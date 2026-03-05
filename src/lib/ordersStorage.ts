// src/lib/ordersStorage.ts
import { readAuth } from "@/lib/authStorage";
import { readProducts } from "@/lib/productsStorage";
import { clearCart, readCart } from "@/lib/cartStorage";

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
  ownerId: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "cancelled" | "fulfilled";
  createdAt: string;
};

const KEY = "cp_orders";

function uid() {
  const g = globalThis as any;
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function readOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeOrders(items: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function placeOrderFromCart() {
  const { user } = readAuth();
  if (!user) throw new Error("Please login");
  if (user.role !== "customer") throw new Error("Only customers can place orders");

  const cart = readCart();
  if (cart.length === 0) throw new Error("Cart is empty");

  const products = readProducts();

  const items: OrderItem[] = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId);
    if (!p) throw new Error("A product in your cart no longer exists");
    return {
      productId: p.id,
      title: p.title,
      price: p.price,
      qty: c.qty,
      ownerId: p.ownerId,
    };
  });

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order: Order = {
    id: uid(),
    customerId: user.id,
    customerName: user.name,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const all = readOrders();
  writeOrders([order, ...all]);
  clearCart();
  return order;
}

export function ordersForCustomer(customerId: string) {
  return readOrders().filter((o) => o.customerId === customerId);
}

export function ordersForEntrepreneur(ownerId: string) {
  return readOrders().filter((o) => o.items.some((i) => i.ownerId === ownerId));
}

export function updateOrderStatus(orderId: string, status: Order["status"]) {
  const { user } = readAuth();
  if (!user) throw new Error("Not logged in");

  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");

  // Admin can update any. Entrepreneur can update only if order contains their products.
  const isAdmin = user.role === "admin";
  const isEnt = user.role === "entrepreneur" && all[idx].items.some((i) => i.ownerId === user.id);
  if (!isAdmin && !isEnt) throw new Error("Not allowed");

  all[idx] = { ...all[idx], status };
  writeOrders(all);
  return all[idx];
}
