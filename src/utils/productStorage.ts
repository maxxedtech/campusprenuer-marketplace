export type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  images?: string[];
  category?: string;
  description: string;
  seller: string;
  sellerId: string;
  createdAt: number;
  updatedAt?: number;
};

const STORAGE_KEY = "campusprenuer_products";

function normalizeProduct(product: Product): Product {
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  return {
    ...product,
    images,
    imageUrl: product.imageUrl || images[0] || "",
  };
}

export function getProducts(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeProduct);
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products.map(normalizeProduct))
  );
}

export function addProduct(product: Product) {
  const products = getProducts();
  products.push(normalizeProduct(product));
  saveProducts(products);
}

export function deleteProduct(id: string) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function getProductsBySeller(sellerId: string): Product[] {
  return getProducts().filter((p) => p.sellerId === sellerId);
}

export function getProductCountBySeller(sellerId: string): number {
  return getProductsBySeller(sellerId).length;
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
}

export function updateProduct(updated: Product) {
  const products = getProducts();
  const next = products.map((p) =>
    p.id === updated.id
      ? normalizeProduct({
          ...updated,
          updatedAt: Date.now(),
        })
      : p
  );
  saveProducts(next);
}

export const getAllProducts = getProducts;
