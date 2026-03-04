import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "customer" | "entrepreneur" | "admin";

export type StoredUser = {
  id?: string;
  name: string;
  role: Role;
  email?: string;
};

type AuthContextValue = {
  user: StoredUser | null;
  loading: boolean;
  signup: (u: StoredUser) => Promise<StoredUser>;
  login: (email: string, password: string) => Promise<StoredUser>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<StoredUser | null>>;
};

const AUTH_KEY = "campusprenuer_user";

const AuthContext = createContext<AuthContextValue | null>(null);

function safeParseUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredUser;
    // basic validation so we don’t treat garbage as a real user
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.role || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Rehydrate on app start (prevents dashboard kicking you out on refresh)
  useEffect(() => {
    const stored = safeParseUser(localStorage.getItem(AUTH_KEY));
    setUser(stored);
    setLoading(false);
  }, []);

  const signup = async (u: StoredUser) => {
    // NOTE: for demo/localStorage only. Replace with backend later.
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const login = async (email: string, _password: string) => {
    // NOTE: for demo/localStorage only. Replace with backend later.
    const stored = safeParseUser(localStorage.getItem(AUTH_KEY));
    if (!stored) throw new Error("No account found. Please sign up first.");

    // If you store email, enforce it
    if (stored.email && stored.email !== email) {
      throw new Error("Account not found for this email.");
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(stored));
    setUser(stored);
    return stored;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
};
