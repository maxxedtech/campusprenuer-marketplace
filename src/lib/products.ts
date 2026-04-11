import { supabase } from "@/supabase";
import { getCurrentUser } from "./auth";

// ➕ ADD PRODUCT
export async function addProduct(data: {
  title: string;
  price: number;
  description?: string;
  image_url?: string;
}) {
  const user = await getCurrentUser();

  if (!user) throw new Error("Not logged in");
  if (user.role !== "entrepreneur")
    throw new Error("Only entrepreneurs can add products");

  const { data: result, error } = await supabase
    .from("products")
    .insert([
      {
        owner_id: user.id,
        owner_name: user.name,
        title: data.title,
        price: data.price,
        description: data.description || "",
        image_url: data.image_url || "",
        active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return result;
}

// 📦 GET ALL PRODUCTS
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// 👤 GET PRODUCTS BY OWNER
export async function getMyProducts() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("owner_id", user.id);

  if (error) throw error;

  return data;
}

// ✏️ UPDATE PRODUCT
export async function updateProduct(id: string, updates: any) {
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

// ❌ DELETE PRODUCT
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
