import { supabase } from "@backend/supabase/client";
import type { LocalProduct } from "@/types/local";
import type { ProductRecord } from "@/types/product";

export const productSelect = "id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status, image_url, images, categories(id, name, slug)";

export function normalizeProduct(row: Record<string, unknown>, seller?: ProductRecord["seller"]): ProductRecord {
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
    images: Array.isArray(row.images) ? row.images.filter((image): image is string => typeof image === "string") : [],
    seller: seller ?? null,
    category,
    media: [],
    store: null,
    sellerName: seller?.full_name || "Seller",
  };
}

async function withSellerProfiles(rows: Record<string, unknown>[]): Promise<ProductRecord[]> {
  if (!rows.length) return [];
  const storeIds = [...new Set(rows.map((row) => String(row.vendor_id)))];
  const { data: stores, error: storeError } = await supabase.from("vendor_stores").select("id, owner_id").in("id", storeIds);
  if (storeError) throw storeError;
  const ownerIds = [...new Set((stores ?? []).map((store) => String(store.owner_id)))];
  const { data: profiles, error: profileError } = ownerIds.length ? await supabase.from("profiles").select("id, full_name, avatar_url, is_verified, city, state").in("id", ownerIds) : { data: [], error: null };
  if (profileError) throw profileError;
  const ownerByStore = new Map((stores ?? []).map((store) => [String(store.id), String(store.owner_id)]));
  const profileById = new Map((profiles ?? []).map((profile) => [String(profile.id), profile]));
  return rows.map((row) => { const ownerId = ownerByStore.get(String(row.vendor_id)); const profile = ownerId ? profileById.get(ownerId) : undefined; return normalizeProduct(row, profile ? { id: String(profile.id), full_name: String(profile.full_name || "Seller"), avatar_url: typeof profile.avatar_url === "string" ? profile.avatar_url : null, is_verified: profile.is_verified === true, city: typeof profile.city === "string" ? profile.city : null, state: typeof profile.state === "string" ? profile.state : null } : null); });
}

export async function fetchPublishedProductRecords(): Promise<ProductRecord[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published");
  if (error) throw error;
  return withSellerProfiles((data ?? []) as Record<string, unknown>[]);
}

export async function fetchProductRecordByIdentifier(identifier: string): Promise<ProductRecord | null> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", identifier).maybeSingle();
  if (error) throw error;
  return data ? (await withSellerProfiles([data as Record<string, unknown>]))[0] : null;
}

function toLocalProduct(product: ProductRecord): LocalProduct {
  return { id: product.id, owner_id: product.vendor_id, owner_name: product.sellerName || "Seller", title: product.title, description: product.description || "", price: product.price_kobo / 100, image_url: product.image_url || "", category: product.category?.name, created_at: "" };
}

export function getProductsSync(): LocalProduct[] { return []; }

export async function getProducts(): Promise<LocalProduct[]> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("status", "published");
  if (error) throw error;
  return (await withSellerProfiles((data ?? []) as Record<string, unknown>[])).map(toLocalProduct);
}

export async function getProductById(id: string): Promise<LocalProduct | null> {
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toLocalProduct((await withSellerProfiles([data as Record<string, unknown>]))[0]) : null;
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
  return (await withSellerProfiles((data ?? []) as Record<string, unknown>[])).map(toLocalProduct);
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
