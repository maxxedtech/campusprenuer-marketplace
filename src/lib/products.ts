import { supabase } from "@/supabase";
import { getCurrentUser } from "./auth";

export async function addProduct(data: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not logged in");

  const { data: result, error } = await supabase
    .from("products")
    .insert([
      {
        owner_id: user.id,
        owner_name: user.name,
        ...data,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function getProducts() {
  const { data } = await supabase.from("products").select("*");
  return data;
}

export async function getMyProducts() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("owner_id", user.id);

  return data;
}

export async function updateProduct(id: string, updates: any) {
  await supabase.from("products").update(updates).eq("id", id);
}

export async function deleteProduct(id: string) {
  await supabase.from("products").delete().eq("id", id);
}
