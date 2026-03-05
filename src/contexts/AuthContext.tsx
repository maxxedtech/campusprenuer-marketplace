// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role, SessionUser } from "@/lib/storage";
import {
  ensureAdminSeeded,
  getSession,
  loginUser,
  logoutUser,
  signupUser,
} from "@/lib/storage";

type AuthContextType = {
  user: SessionUser | null;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  signup: (payload: { name: string; email: string; password: string; role: Role }) => Promise<SessionUser>;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    ensureAdminSeeded(); // makes sure admin exists
    setUser(getSession());
  }, []);

  const refresh = () => setUser(getSession());

  const login = async (email: string, password: string) => {
    const u = loginUser(email, password);
    setUser(u);
    return u;
  };

  const signup = async (payload: { name: string; email: string; password: string; role: Role }) => {
    const u = signupUser(payload);
    setUser(u);
    return u;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      login,
      signup,
      logout,
      refresh,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
