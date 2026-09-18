import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, signUpUser } from "@/lib/auth";
import type { Role, UserRecord } from "@/utils/userStorage";

type SessionUser = UserRecord;
type SignupPayload = Omit<UserRecord, "id" | "createdAt">;
type AuthContextType = { user: SessionUser | null; isAuthed: boolean; login: (email: string, password: string) => Promise<SessionUser>; signup: (payload: SignupPayload) => Promise<SessionUser>; logout: () => Promise<void>; refresh: () => Promise<void> };
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const refresh = async () => setUser(await getCurrentUser());
  useEffect(() => { refresh(); const onChange = () => refresh(); window.addEventListener("campus-auth-change", onChange); window.addEventListener("storage", onChange); return () => { window.removeEventListener("campus-auth-change", onChange); window.removeEventListener("storage", onChange); }; }, []);
  const value = useMemo<AuthContextType>(() => ({ user, isAuthed: Boolean(user), login: async (email, password) => { const next = await loginUser(email, password); setUser(next); return next; }, signup: async (payload) => { const next = await signUpUser(payload); setUser(next); return next; }, logout: async () => { await logoutUser(); setUser(null); }, refresh }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
