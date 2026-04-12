import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/supabase";

/* ================= TYPES ================= */
type Role = "customer" | "entrepreneur" | "admin";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
};

/* ================= CONTEXT TYPE ================= */
type AuthContextType = {
  user: SessionUser | null;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setUser(null);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      });
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 auto listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await loadUser();
  };

  /* ================= SIGNUP ================= */
  const signup = async ({
    name,
    email,
    password,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // 🔥 create profile in users table
    if (data.user) {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          name,
          role,
          avatar_url: "",
        },
      ]);
    }

    await loadUser();
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* ================= REFRESH ================= */
  const refresh = async () => {
    await loadUser();
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

/* ================= HOOK ================= */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
