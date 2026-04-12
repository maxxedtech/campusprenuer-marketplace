import { supabase } from "@/supabase";
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

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function placeOrderFromCart() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please login");

  const cart = readCart();
  if (cart.length === 0) throw new Error("Cart is empty");

  const items: OrderItem[] = cart.map((c) => {
    const p = getProductById(c.productId);
    if (!p) throw new Error("Product not found");

    return {
      productId: p.id,
      name: p.name,
      price: Number(p.price || 0),
      qty: c.qty,
      sellerId: p.sellerId,
      sellerName: p.seller || "Entrepreneur",
    };
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const order: Order = {
    id: uid(),
    customerId: user.id,
    customerName: user.email || "Customer",
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
  return readOrders().filter((o) =>
    o.items.some((i) => i.sellerId === sellerId)
  );
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not logged in");

  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");

  all[idx].status = status;
  writeOrders(all);

  return all[idx];
}
