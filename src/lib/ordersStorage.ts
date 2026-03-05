// src/lib/ordersStorage.ts
import { readAuth } from "@/lib/authStorage";
import { getProductById } from "@/utils/productStorage";
import { clearCart, readCart } from "@/lib/cartStorage";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  sellerId: string;
  sellerName: string;
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

const KEY = "campusprenuer_orders";

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

function priceToNumber(price: any) {
  // supports "3500" or "3,500"
  const cleaned = String(price ?? "0").replace(/[^\d.]/g, "");
  const n = Number(cleaned || 0);
  return Number.isFinite(n) ? n : 0;
}

export function placeOrderFromCart() {
  const { user } = readAuth();
  if (!user) throw new Error("Please login");
  if (user.role !== "customer") throw new Error("Only customers can place orders");

  const cart = readCart();
  if (cart.length === 0) throw new Error("Cart is empty");

  const items: OrderItem[] = cart.map((c) => {
    const p = getProductById(c.productId);
    if (!p) throw new Error("A product in your cart no longer exists");

    return {
      productId: p.id,
      name: p.name,
      price: priceToNumber(p.price),
      qty: Math.max(1, Math.floor(Number(c.qty) || 1)),
      sellerId: p.sellerId,
      sellerName: p.seller || "Entrepreneur",
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

  writeOrders([order, ...readOrders()]);
  clearCart();
  return order;
}

export function ordersForCustomer(customerId: string) {
  return readOrders().filter((o) => o.customerId === customerId);
}

export function ordersForSeller(sellerId: string) {
  return readOrders().filter((o) => o.items.some((i) => i.sellerId === sellerId));
}

export function updateOrderStatus(orderId: string, status: Order["status"]) {
  const { user } = readAuth();
  if (!user) throw new Error("Not logged in");

  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");

  const isAdmin = user.role === "admin";
  const isSeller =
    user.role === "entrepreneur" && all[idx].items.some((i) => i.sellerId === user.id);

  if (!isAdmin && !isSeller) throw new Error("Not allowed");

  all[idx] = { ...all[idx], status };
  writeOrders(all);
  return all[idx];
}
