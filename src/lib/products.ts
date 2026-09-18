import { getCurrentUser } from "@/lib/auth";
import { makeId, readJson, writeJson } from "@/lib/localStorage";
import type { LocalProduct } from "@/types/local";

const KEY = "campusprenuer_products";
export function getProductsSync() { return readJson<LocalProduct[]>(KEY, []); }

export async function addProduct(data: Partial<LocalProduct>) {
  const user = await getCurrentUser();
  if (!user || user.role !== "entrepreneur") throw new Error("Only entrepreneurs can add products.");
  const product: LocalProduct = { id: makeId(), owner_id: user.id, owner_name: user.name, title: data.title?.trim() || "Untitled product", description: data.description?.trim() || "", price: Number(data.price || 0), image_url: data.image_url || "", created_at: new Date().toISOString() };
  writeJson(KEY, [product, ...getProductsSync()]);
  return product;
}
export async function getProducts() { return getProductsSync(); }
export async function getProductById(id: string) { return getProductsSync().find((product) => product.id === id) ?? null; }
export async function getMyProducts() { const user = await getCurrentUser(); return user ? getProductsSync().filter((product) => product.owner_id === user.id) : []; }
export async function updateProduct(id: string, updates: Partial<LocalProduct>) {
  const user = await getCurrentUser(); const products = getProductsSync(); const index = products.findIndex((product) => product.id === id);
  if (!user || index === -1) throw new Error("Product not found.");
  if (products[index].owner_id !== user.id) throw new Error("You cannot edit this product.");
  products[index] = { ...products[index], ...updates, id, owner_id: user.id, owner_name: user.name }; writeJson(KEY, products); return products[index];
}
export async function deleteProduct(id: string) {
  const user = await getCurrentUser(); const product = getProductsSync().find((item) => item.id === id);
  if (!user || !product) throw new Error("Product not found.");
  if (product.owner_id !== user.id && user.role !== "admin") throw new Error("You cannot delete this product.");
  deleteProductAsAdmin(id);
}
export function deleteProductAsAdmin(id: string) { writeJson(KEY, getProductsSync().filter((item) => item.id !== id)); }
