export type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  category?: string;
  description: string;
  seller: string;
  sellerId: string;
  createdAt: number;
};

const STORAGE_KEY = "campusprenuer_products";

export function getProducts(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function deleteProduct(id: string) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function getProductsBySeller(sellerId: string) {
  return getProducts().filter((p) => p.sellerId === sellerId);
}
export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
}

export function updateProduct(updated: Product) {
  const products = getProducts();
  const next = products.map((p) => (p.id === updated.id ? updated : p));
  saveProducts(next);
}
