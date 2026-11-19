import { supabase } from "@/lib/supabase";
import type { LocalProduct } from "@/types/local";
import type { ProductMedia, ProductRecord } from "@/types/product";

export const productSelect = "id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status, created_at, updated_at, categories(id, name, slug), product_media(id, product_id, public_id, secure_url, resource_type, format, width, height, bytes, folder, sort_order, deleted_at), vendor_stores(id, owner_id, store_name, slug, campus, status)";

export function normalizeProduct(row: Record<string, unknown>): ProductRecord {
  const category = row.categories as ProductRecord["category"] | null;
  const media = (Array.isArray(row.product_media) ? row.product_media : []) as ProductMedia[];
  const store = row.vendor_stores as ProductRecord["store"];
  return { id: String(row.id), vendor_id: String(row.vendor_id), title: String(row.title), slug: String(row.slug), category_id: row.category_id ? String(row.category_id) : null, description: row.description ? String(row.description) : null, price_kobo: Number(row.price_kobo || 0), stock_quantity: Number(row.stock_quantity || 0), status: row.status as ProductRecord["status"], created_at: String(row.created_at), updated_at: row.updated_at ? String(row.updated_at) : null, category, media: media.filter((item) => !item.deleted_at).sort((a, b) => a.sort_order - b.sort_order), store, sellerName: store?.store_name };
}

export async function fetchPublishedProductRecords(): Promise<ProductRecord[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published").eq("vendor_stores.status", "approved").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => normalizeProduct(row as Record<string, unknown>));
}

export async function fetchProductRecordByIdentifier(identifier: string): Promise<ProductRecord | null> {
  const byId = await supabase.from("products").select(productSelect).eq("id", identifier).maybeSingle();
  if (byId.error) throw byId.error;
  if (byId.data) return normalizeProduct(byId.data as Record<string, unknown>);
  const bySlug = await supabase.from("products").select(productSelect).eq("slug", identifier).maybeSingle();
  if (bySlug.error) throw bySlug.error;
  return bySlug.data ? normalizeProduct(bySlug.data as Record<string, unknown>) : null;
}

function toLocalProduct(product: ProductRecord): LocalProduct {
  return { id: product.id, owner_id: product.store?.owner_id || product.vendor_id, owner_name: product.sellerName || product.store?.store_name || "Campus seller", title: product.title, description: product.description || "", price: product.price_kobo / 100, image_url: product.media[0]?.secure_url || "", category: product.category?.name, created_at: product.created_at };
}

export function getProductsSync(): LocalProduct[] { return []; }

export async function getProducts(): Promise<LocalProduct[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published").eq("vendor_stores.status", "approved").order("created_at", { ascending: false });
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
  const { data: stores, error: storeError } = await supabase.from("vendor_stores").select("id").eq("owner_id", userId);
  if (storeError) throw storeError;
  const storeIds = (stores ?? []).map((store) => String(store.id));
  if (!storeIds.length) return [];
  const { data, error } = await supabase.from("products").select(productSelect).in("vendor_id", storeIds).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => toLocalProduct(normalizeProduct(row as Record<string, unknown>)));
}

export async function updateProduct(id: string, updates: Partial<LocalProduct>) {
  const { error } = await supabase.from("products").update({ title: updates.title, description: updates.description, price_kobo: updates.price === undefined ? undefined : Math.round(Number(updates.price) * 100), updated_at: new Date().toISOString() }).eq("id", id);
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
