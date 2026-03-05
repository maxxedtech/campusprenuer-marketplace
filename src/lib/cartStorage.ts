// src/lib/cartStorage.ts
import { readAuth } from "@/lib/authStorage";
import type { Product } from "@/lib/productsStorage";

export type CartItem = {
  productId: string;
  qty: number;
};

function keyForUser(userId: string) {
  return `cp_cart_${userId}`;
}

export function readCart(): CartItem[] {
  const { user } = readAuth();
  if (!user) return [];
  try {
    return JSON.parse(localStorage.getItem(keyForUser(user.id)) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  const { user } = readAuth();
  if (!user) return;
  localStorage.setItem(keyForUser(user.id), JSON.stringify(items));
}

export function addToCart(productId: string, qty: number) {
  const { user } = readAuth();
  if (!user) throw new Error("Please login");
  if (qty < 1) qty = 1;

  const cart = readCart();
  const idx = cart.findIndex((i) => i.productId === productId);

  if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
  else cart.push({ productId, qty });

  writeCart(cart);
}

export function setQty(productId: string, qty: number) {
  if (qty < 1) qty = 1;
  const cart = readCart();
  const idx = cart.findIndex((i) => i.productId === productId);
  if (idx === -1) return;
  cart[idx] = { ...cart[idx], qty };
  writeCart(cart);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((i) => i.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount() {
  return readCart().reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(products: Product[]) {
  const cart = readCart();
  return cart.reduce((sum, i) => {
    const p = products.find((x) => x.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}
