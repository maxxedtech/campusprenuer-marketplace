import { getCurrentUser } from "@/lib/auth";
import { readCart, clearCart } from "@/lib/cartStorage";
import { getProductById } from "@/lib/products";
import { makeId, readJson, writeJson } from "@/lib/localStorage";

export type OrderItem = { productId: string; name: string; price: number; qty: number; sellerId: string; sellerName: string };
export type Order = { id: string; customerId: string; customerName: string; items: OrderItem[]; total: number; status: "pending" | "confirmed" | "cancelled" | "fulfilled"; createdAt: string };
const KEY = "campusprenuer_orders";
export const readOrders = () => readJson<Order[]>(KEY, []);
export const writeOrders = (items: Order[]) => writeJson(KEY, items);

export async function placeOrderFromCart() {
  const user = await getCurrentUser(); if (!user) throw new Error("Please login first.");
  const cart = readCart(); if (!cart.length) throw new Error("Cart is empty.");
  const items: OrderItem[] = [];
  for (const item of cart) { const product = await getProductById(item.productId); if (!product) throw new Error("A product in your cart no longer exists."); items.push({ productId: product.id, name: product.title, price: product.price, qty: item.qty, sellerId: product.owner_id, sellerName: product.owner_name }); }
  const order: Order = { id: makeId(), customerId: user.id, customerName: user.name, items, total: items.reduce((sum, item) => sum + item.price * item.qty, 0), status: "pending", createdAt: new Date().toISOString() };
  writeOrders([order, ...readOrders()]); clearCart(); return order;
}
export function ordersForCustomer(customerId: string) { return readOrders().filter((order) => order.customerId === customerId); }
export function ordersForSeller(sellerId: string) { return readOrders().filter((order) => order.items.some((item) => item.sellerId === sellerId)); }
export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const user = await getCurrentUser(); if (!user) throw new Error("Not logged in."); const orders = readOrders(); const index = orders.findIndex((order) => order.id === orderId); if (index < 0) throw new Error("Order not found.");
  if (user.role !== "admin" && !orders[index].items.some((item) => item.sellerId === user.id)) throw new Error("You cannot update this order.");
  orders[index] = { ...orders[index], status }; writeOrders(orders); return orders[index];
}
