// src/lib/productsStorage.ts
import { readAuth } from "@/lib/authStorage";

export type Product = {
  id: string;
  ownerId: string; // entrepreneur id
  ownerName: string;
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  active: boolean;
};

const KEY = "cp_products";

function uid() {
  const g = globalThis as any;
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function readProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeProducts(items: Product[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addProduct(payload: Omit<Product, "id" | "ownerId" | "ownerName" | "createdAt" | "active">) {
  const { user } = readAuth();
  if (!user) throw new Error("Not logged in");
  if (user.role !== "entrepreneur") throw new Error("Only entrepreneurs can add products");

  const product: Product = {
    id: uid(),
    ownerId: user.id,
    ownerName: user.name,
    title: payload.title,
    price: Number(payload.price),
    description: payload.description || "",
    imageUrl: payload.imageUrl || "",
    createdAt: new Date().toISOString(),
    active: true,
  };

  const all = readProducts();
  writeProducts([product, ...all]);
  return product;
}

export function updateProduct(productId: string, patch: Partial<Product>) {
  const { user } = readAuth();
  if (!user) throw new Error("Not logged in");

  const all = readProducts();
  const idx = all.findIndex((p) => p.id === productId);
  if (idx === -1) throw new Error("Product not found");

  const p = all[idx];
  const isOwner = p.ownerId === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("Not allowed");

  all[idx] = { ...p, ...patch };
  writeProducts(all);
  return all[idx];
}

export function deleteProduct(productId: string) {
  const { user } = readAuth();
  if (!user) throw new Error("Not logged in");

  const all = readProducts();
  const p = all.find((x) => x.id === productId);
  if (!p) return;

  const isOwner = p.ownerId === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("Not allowed");

  writeProducts(all.filter((x) => x.id !== productId));
}

export function getProduct(productId: string) {
  return readProducts().find((p) => p.id === productId) || null;
}
