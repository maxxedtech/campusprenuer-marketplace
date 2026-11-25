import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  cleanAuthCallbackUrl,
  clearEmailVerificationPending,
  hasEmailVerificationCallbackParams,
  isEmailVerificationPending,
} from "@/lib/authVerification";

export type Role = "entrepreneur" | "customer" | "admin";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state?: string | null;
  avatar_url: string | null;
  is_verified?: boolean;
  guarantor_name?: string | null;
  guarantor_phone?: string | null;
  guarantor_relationship?: string | null;
  guarantor_occupation_address?: string | null;
}

export interface VendorStore {
  id: string;
  store_name: string;
  slug: string;
  city: string;
  state: string;
  business_category?: string | null;
  phone?: string | null;
  pickup_note?: string | null;
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
  city?: string;
  state?: string;
};

const PASSWORD_RECOVERY_PATHS = new Set(["/update-password", "/reset-password"]);

function isPasswordRecoveryPath() {
  return PASSWORD_RECOVERY_PATHS.has(window.location.pathname);
}

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

function roleFromRoles(roles: string[], fallbackRole?: unknown): Role {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("vendor") || roles.includes("entrepreneur")) return "entrepreneur";
  if (fallbackRole === "admin") return "admin";
  if (fallbackRole === "vendor" || fallbackRole === "entrepreneur") return "entrepreneur";
  return "customer";
}

function decorateUser(user: User, profile: UserProfile | null, roles: string[]): AuthUser {
  const role = roleFromRoles(roles, user.app_metadata?.role ?? user.user_metadata?.role);
  const name = profile?.full_name || user.user_metadata?.full_name || user.email || "Member";

  return {
    ...user,
    role,
    name,
    avatar_url: profile?.avatar_url ?? null,
    verification_status: role === "admin" || profile?.is_verified === true ? "verified" : "unverified",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [vendorStore, setVendorStore] = useState<VendorStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerifiedNotice, setEmailVerifiedNotice] = useState(false);
  const verificationHandledRef = useRef(false);

  const loadAccountData = useCallback(async (accountUser: User) => {
    const metadata = accountUser.user_metadata ?? {};
    const nextProfile: UserProfile = {
      id: accountUser.id,
      full_name: String(metadata.full_name ?? accountUser.email ?? "Member"),
      email: accountUser.email ?? "",
      phone: typeof metadata.phone === "string" ? metadata.phone : null,
      city: typeof metadata.city === "string" ? metadata.city : null,
      state: typeof metadata.state === "string" ? metadata.state : null,
      avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
      guarantor_name: typeof metadata.guarantor_name === "string" ? metadata.guarantor_name : null,
      guarantor_phone: typeof metadata.guarantor_phone === "string" ? metadata.guarantor_phone : null,
      guarantor_relationship: typeof metadata.guarantor_relationship === "string" ? metadata.guarantor_relationship : null,
      guarantor_occupation_address: typeof metadata.guarantor_occupation_address === "string" ? metadata.guarantor_occupation_address : null,
    };
    const { data: profileData } = await supabase.from("profiles").select("id, full_name, email, phone, city, state, avatar_url, is_verified, guarantor_name, guarantor_phone, guarantor_relationship, guarantor_occupation_address").eq("id", accountUser.id).maybeSingle();
    if (profileData) Object.assign(nextProfile, profileData, { email: accountUser.email ?? "" });
    else {
      const { data: createdProfile } = await supabase.from("profiles").upsert({
        id: accountUser.id, full_name: nextProfile.full_name, email: nextProfile.email, phone: nextProfile.phone,
        city: nextProfile.city, state: nextProfile.state, avatar_url: nextProfile.avatar_url,
        guarantor_name: nextProfile.guarantor_name, guarantor_phone: nextProfile.guarantor_phone,
        guarantor_relationship: nextProfile.guarantor_relationship,
        guarantor_occupation_address: nextProfile.guarantor_occupation_address,
      }).select("id, full_name, email, phone, city, state, avatar_url, is_verified, guarantor_name, guarantor_phone, guarantor_relationship, guarantor_occupation_address").maybeSingle();
      if (createdProfile) Object.assign(nextProfile, createdProfile, { email: accountUser.email ?? "" });
    }
    const metadataRole = accountUser.app_metadata?.role ?? metadata.role;
    const nextRoles = typeof metadataRole === "string" ? [metadataRole] : [];
    const { data: storeData, error: storeError } = await supabase
      .from("vendor_stores")
      .select("id, store_name, slug, city, state, description, business_category, phone, pickup_note, status")
      .eq("owner_id", accountUser.id)
      .maybeSingle();
    if (storeError) throw storeError;
    const nextStore = storeData as VendorStore | null;

    setProfile(nextProfile);
    setRoles(nextRoles);
    setVendorStore(nextStore);
    setUser(decorateUser(accountUser, nextProfile, nextRoles));
    return { profile: nextProfile, roles: nextRoles, vendorStore: nextStore };
  }, []);

  const handleSession = useCallback(async (nextSession: Session | null) => {
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
  }, [loadAccountData]);

  const handleVerifiedSession = useCallback(async (nextSession: Session | null, fromAuthCallback = false) => {
    if (isPasswordRecoveryPath()) return false;
    if (!nextSession?.user || !nextSession.user.email_confirmed_at) return false;
    if (verificationHandledRef.current) return false;

    const shouldHandle = fromAuthCallback || isEmailVerificationPending();
    if (!shouldHandle) return false;

    verificationHandledRef.current = true;
    clearEmailVerificationPending();
    cleanAuthCallbackUrl();
    setEmailVerifiedNotice(true);

    window.setTimeout(() => {
      window.location.replace(`${window.location.origin}/`);
    }, 900);

    return true;
  }, []);

  useEffect(() => {
    let mounted = true;
    let callbackHandled = false;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const checkSessionForVerification = async (fromAuthCallback = false) => {
      const { data } = await supabase.auth.getSession();
      if (!mounted || !data.session) return;

      const handled = await handleVerifiedSession(data.session, fromAuthCallback);
      if (handled) callbackHandled = true;
    };

    const code = new URLSearchParams(window.location.search).get("code");
    if (code && !isPasswordRecoveryPath()) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!mounted || error || !data.session) return;
        void handleSession(data.session);
        void handleVerifiedSession(data.session, hasEmailVerificationCallbackParams());
      });
    }

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        void handleSession(data.session);
        if (!callbackHandled) void checkSessionForVerification(hasEmailVerificationCallbackParams());
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;

      void handleSession(nextSession);
      if (event === "SIGNED_IN" && !isPasswordRecoveryPath()) {
        void handleVerifiedSession(nextSession, hasEmailVerificationCallbackParams());
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSessionForVerification();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleSession, handleVerifiedSession]);

  const refreshAccount = useCallback(async () => {
    if (session?.user) await loadAccountData(session.user);
  }, [loadAccountData, session]);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Authentication is not configured for this deployment yet.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign in did not return a user.");
    const account = await loadAccountData(data.user);
    return decorateUser(data.user, account.profile, account.roles);
  }, [loadAccountData]);

  const signup = useCallback(async (payload: SignupPayload) => {
    if (!isSupabaseConfigured) {
      throw new Error("Authentication is not configured for this deployment yet.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: `${window.location.origin}`,
        data: {
          full_name: payload.name,
          phone: payload.phone ?? null,
          city: payload.city ?? null,
          state: payload.state ?? "Borno",
          role: payload.role === "entrepreneur" ? "vendor" : payload.role,
        },
      },
    });
    if (error) throw error;
    if (!data.session || !data.user) return null;
    const account = await loadAccountData(data.user);
    setSession(data.session);
    return decorateUser(data.user, account.profile, account.roles);
  }, [loadAccountData]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

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
  }), [login, profile, refreshAccount, roles, session, signOut, signup, user, vendorStore, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {emailVerifiedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/45 p-4 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 text-center shadow-soft-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</div>
            <h2 className="mt-4 font-display text-xl font-semibold text-brand-navy">Email verified!</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your account is ready. Redirecting you to CampusPreneur...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
