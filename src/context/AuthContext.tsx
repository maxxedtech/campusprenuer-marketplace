import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type Role = "entrepreneur" | "customer" | "admin";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  campus: string | null;
  avatar_url: string | null;
}

export interface VendorStore {
  id: string;
  store_name: string;
  slug: string;
  campus: string;
  description: string | null;
  status: "pending" | "approved" | "rejected" | "suspended";
}

export type AuthUser = User & {
  role: Role;
  name: string;
  avatar_url: string | null;
  verification_status: "unverified" | "pending" | "verified";
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  campus?: string;
};

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  profile: UserProfile | null;
  roles: string[];
  vendorStore: VendorStore | null;
  loading: boolean;
  isAuthed: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  refreshAccount: () => Promise<void>;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function roleFromRoles(roles: string[]): Role {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("vendor") || roles.includes("entrepreneur")) return "entrepreneur";
  return "customer";
}

function decorateUser(user: User, profile: UserProfile | null, roles: string[]): AuthUser {
  const role = roleFromRoles(roles);
  const name = profile?.full_name || user.user_metadata?.full_name || user.email || "Campus member";

  return {
    ...user,
    role,
    name,
    avatar_url: profile?.avatar_url ?? null,
    verification_status: role === "admin" ? "verified" : "unverified",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [vendorStore, setVendorStore] = useState<VendorStore | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAccountData = async (accountUser: User) => {
    const [profileRes, rolesRes, storeRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone, campus, avatar_url").eq("id", accountUser.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", accountUser.id),
      supabase.from("vendor_stores").select("id, store_name, slug, campus, description, status").eq("owner_id", accountUser.id).maybeSingle(),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (rolesRes.error) throw rolesRes.error;
    if (storeRes.error) throw storeRes.error;

    const nextProfile = profileRes.data as UserProfile | null;
    const nextRoles = (rolesRes.data ?? []).map((item) => String(item.role));
    const nextStore = storeRes.data as VendorStore | null;

    setProfile(nextProfile);
    setRoles(nextRoles);
    setVendorStore(nextStore);
    setUser(decorateUser(accountUser, nextProfile, nextRoles));
    return { profile: nextProfile, roles: nextRoles, vendorStore: nextStore };
  };

  const handleSession = async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!nextSession?.user) {
      setUser(null);
      setProfile(null);
      setRoles([]);
      setVendorStore(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await loadAccountData(nextSession.user);
    } catch {
      setUser(decorateUser(nextSession.user, null, []));
      setProfile(null);
      setRoles([]);
      setVendorStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) void handleSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) void handleSession(nextSession);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshAccount = async () => {
    if (session?.user) await loadAccountData(session.user);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign in did not return a user.");
    const account = await loadAccountData(data.user);
    return decorateUser(data.user, account.profile, account.roles);
  };

  const signup = async (payload: SignupPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: payload.name,
          phone: payload.phone ?? null,
          campus: payload.campus ?? null,
          role: payload.role === "entrepreneur" ? "vendor" : payload.role,
        },
      },
    });
    if (error) throw error;
    if (!data.session || !data.user) return null;
    const account = await loadAccountData(data.user);
    setSession(data.session);
    return decorateUser(data.user, account.profile, account.roles);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo<AuthContextType>(() => ({
    session,
    user,
    profile,
    roles,
    vendorStore,
    loading,
    isAuthed: Boolean(session),
    isVendor: roles.includes("vendor") || roles.includes("entrepreneur"),
    isAdmin: roles.includes("admin"),
    refreshAccount,
    refresh: refreshAccount,
    login,
    signup,
    logout: signOut,
    signOut,
  }), [session, user, profile, roles, vendorStore, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
