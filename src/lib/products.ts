import { supabase } from "@/lib/supabase";
import type { LocalProduct } from "@/types/local";
import type { ProductRecord } from "@/types/product";

export const productSelect = "id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status, image_url, categories(id, name, slug)";

export function normalizeProduct(row: Record<string, unknown>): ProductRecord {
  const category = row.categories as ProductRecord["category"] | null;
  return {
    id: String(row.id),
    vendor_id: String(row.vendor_id),
    title: String(row.title),
    slug: String(row.slug),
    category_id: row.category_id ? String(row.category_id) : null,
    description: row.description ? String(row.description) : null,
    price_kobo: Number(row.price_kobo || 0),
    stock_quantity: Number(row.stock_quantity || 0),
    status: row.status as ProductRecord["status"],
    image_url: typeof row.image_url === "string" ? row.image_url : null,
    category,
    media: [],
    store: null,
    sellerName: "Campus seller",
  };
}

export async function fetchPublishedProductRecords(): Promise<ProductRecord[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
}

export async function fetchProductRecordByIdentifier(identifier: string): Promise<ProductRecord | null> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", identifier).maybeSingle();
  if (error) throw error;
  return data ? normalizeProduct(data as Record<string, unknown>) : null;
}

function toLocalProduct(product: ProductRecord): LocalProduct {
  return { id: product.id, owner_id: product.vendor_id, owner_name: product.sellerName || "Campus seller", title: product.title, description: product.description || "", price: product.price_kobo / 100, image_url: product.image_url || "", category: product.category?.name, created_at: "" };
}

export function getProductsSync(): LocalProduct[] { return []; }

export async function getProducts(): Promise<LocalProduct[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((row) => toLocalProduct(normalizeProduct(row as Record<string, unknown>)));
}

export async function getProductById(id: string): Promise<LocalProduct | null> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toLocalProduct(normalizeProduct(data as Record<string, unknown>)) : null;
}

export async function getMyProducts(): Promise<LocalProduct[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];
  const { data: store, error: storeError } = await supabase.from("vendor_stores").select("id").eq("owner_id", userId).maybeSingle();
  if (storeError) throw storeError;
  if (!store) return [];
  const { data, error } = await supabase.from("products").select(productSelect).eq("vendor_id", store.id);
  if (error) throw error;
  return (data ?? []).map((row) => toLocalProduct(normalizeProduct(row as Record<string, unknown>)));
}

export async function updateProduct(id: string, updates: Partial<LocalProduct>) {
  const { error } = await supabase.from("products").update({ title: updates.title, description: updates.description, price_kobo: updates.price === undefined ? undefined : Math.round(Number(updates.price) * 100) }).eq("id", id);
  if (error) throw error;
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found.");
  return product;
}

export function incrementProductViews(_id: string) { return; }
export function incrementProductCartAdds(_id: string) { return; }
export function incrementProductSales(_id: string, _qty = 1) { return; }

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteProductAsAdmin(id: string) {
  await deleteProduct(id);
}
