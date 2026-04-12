import { supabase } from "@/supabase";

export async function signUpUser(data: any) {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  await supabase.from("users").insert([
    {
      id: authData.user?.id,
      ...data,
      created_at: new Date(),
    },
  ]);

  return authData.user;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return userData;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return userData;
}
