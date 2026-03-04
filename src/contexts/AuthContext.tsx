import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "entrepreneur" | "customer" | "admin";

export type StoredUser = {
  id: string;
  name: string;
  email?: string;
  role: Role;
};

type AuthContextValue = {
  user: StoredUser | null;
  loading: boolean;
  loginLocal: (user: StoredUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "user";
const TOKEN_KEY = "token";

function safeParseUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    if (!u || typeof u !== "object") return null;
    if (!u.name || !u.role || !u.id) return null;
    return u as StoredUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ load saved auth once
  useEffect(() => {
    const stored = safeParseUser(localStorage.getItem(USER_KEY));
    setUser(stored);
    setLoading(false);
  }, []);

  // ✅ call this after signup/login to update UI immediately
  const loginLocal = (u: StoredUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, "local"); // token is optional but keeps old logic happy
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, loginLocal, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
