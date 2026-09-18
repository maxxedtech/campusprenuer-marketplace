export type CartItem = { productId: string; qty: number };
const KEY = "campusprenuer_cart";
function read(): CartItem[] { try { return JSON.parse(localStorage.getItem(KEY) || "[]") as CartItem[]; } catch { return []; } }
function write(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event("campus-cart-change")); }
export function readCart() { return read(); }
export function clearCart() { write([]); }
export function addToCart(productId: string, qty = 1) { const items = read(); const existing = items.find((item) => item.productId === productId); if (existing) existing.qty += qty; else items.push({ productId, qty }); write(items); }
export function removeFromCart(productId: string) { write(read().filter((item) => item.productId !== productId)); }
export function setQty(productId: string, qty: number) { if (qty <= 0) return removeFromCart(productId); write(read().map((item) => item.productId === productId ? { ...item, qty } : item)); }
