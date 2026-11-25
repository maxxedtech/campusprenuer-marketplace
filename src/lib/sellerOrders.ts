import { supabase } from "@/lib/supabase";

export type SellerOrderStatus = "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
export type SellerOrderItem = { id: string; order_id: string; product_id: string; quantity: number; unit_price_kobo: number; product: { id: string; title: string; image_url: string | null; images: string[] | null } | null };
export type SellerOrder = { id: string; buyer_id: string; status: SellerOrderStatus; total_kobo: number; payment_status: string | null; created_at: string; delivery_city: string | null; delivery_state: string | null; delivery_note: string | null; buyer: { id: string; full_name: string; phone: string | null; city: string | null; state: string | null; avatar_url: string | null } | null; items: SellerOrderItem[] };
const logAndThrow = (label: string, error: unknown): never => { console.error(`[sellerOrders] ${label}:`, error instanceof Error ? error.message : error); throw error; };

export async function fetchSellerOrders(sellerId: string, storeId = sellerId): Promise<SellerOrder[]> {
  const { data: products, error: productError } = await supabase.from("products").select("id,title,image_url,images,vendor_id,user_id").or(`vendor_id.eq.${sellerId},user_id.eq.${sellerId},vendor_id.eq.${storeId},user_id.eq.${storeId}`);
  if (productError) logAndThrow("products query failed", productError);
  const productById = new Map((products ?? []).map((p) => [String(p.id), p])); const productIds = [...productById.keys()];
  let itemQuery = supabase.from("order_items").select("id,order_id,vendor_order_id,product_id,vendor_id,product_title_snapshot,unit_price_kobo,quantity,created_at");
  if (productIds.length) itemQuery = itemQuery.or(`product_id.in.(${productIds.join(",")}),vendor_id.eq.${sellerId},vendor_id.eq.${storeId}`);
  else itemQuery = itemQuery.or(`vendor_id.eq.${sellerId},vendor_id.eq.${storeId}`);
  const { data: rows, error: itemError } = await itemQuery;
  if (itemError) logAndThrow("order_items query failed", itemError);
  const itemRows = rows ?? []; if (!itemRows.length) return [];
  const unresolved = itemRows.filter((r) => !r.order_id && r.vendor_order_id).map((r) => String(r.vendor_order_id));
  const vendorOrderMap = new Map<string, string>();
  if (unresolved.length) {
    const { data: legacy, error } = await supabase.from("vendor_orders").select("id,order_id").in("id", [...new Set(unresolved)]);
    if (error) console.error("[sellerOrders] optional vendor_orders lookup:", error.message);
    for (const row of legacy ?? []) if (row.order_id) vendorOrderMap.set(String(row.id), String(row.order_id));
  }
  const normalizedItems = itemRows.map((r) => ({ row: r, orderId: r.order_id ? String(r.order_id) : vendorOrderMap.get(String(r.vendor_order_id)) }));
  const orderIds = [...new Set(normalizedItems.map((r) => r.orderId).filter((id): id is string => !!id))]; if (!orderIds.length) return [];
  const { data: orderRows, error: orderError } = await supabase.from("orders").select("id,buyer_id,status,total_amount_kobo,total_kobo,payment_status,created_at,delivery_city,delivery_state,delivery_notes,delivery_note,buyer_phone").in("id", orderIds).order("created_at", { ascending: false });
  if (orderError) logAndThrow("orders query failed", orderError);
  const buyerIds = [...new Set((orderRows ?? []).map((o) => String(o.buyer_id || "")).filter(Boolean))];
  const { data: buyers, error: buyerError } = buyerIds.length ? await supabase.from("profiles").select("id,full_name,email,phone,avatar_url,city,state").in("id", buyerIds) : { data: [], error: null };
  if (buyerError) logAndThrow("buyer profiles query failed", buyerError);
  const buyerById = new Map((buyers ?? []).map((b) => [String(b.id), b]));
  const itemsByOrder = new Map<string, SellerOrderItem[]>();
  for (const { row, orderId } of normalizedItems) { if (!orderId) continue; const product = productById.get(String(row.product_id)); const item: SellerOrderItem = { id: String(row.id), order_id: orderId, product_id: String(row.product_id || ""), quantity: Number(row.quantity || 0), unit_price_kobo: Number(row.unit_price_kobo || 0), product: product ? { id: String(product.id), title: String(product.title || row.product_title_snapshot || "Product"), image_url: product.image_url || null, images: Array.isArray(product.images) ? product.images : null } : row.product_title_snapshot ? { id: String(row.product_id || ""), title: String(row.product_title_snapshot), image_url: null, images: null } : null }; itemsByOrder.set(orderId, [...(itemsByOrder.get(orderId) ?? []), item]); }
  return (orderRows ?? []).map((o) => { const buyer = buyerById.get(String(o.buyer_id)); return { id: String(o.id), buyer_id: String(o.buyer_id || ""), status: String(o.status || "pending") as SellerOrderStatus, total_kobo: Number(o.total_kobo ?? o.total_amount_kobo ?? 0), payment_status: o.payment_status ? String(o.payment_status) : null, created_at: String(o.created_at || ""), delivery_city: o.delivery_city || buyer?.city || null, delivery_state: o.delivery_state || buyer?.state || null, delivery_note: o.delivery_note || o.delivery_notes || null, buyer: buyer ? { id: String(buyer.id), full_name: String(buyer.full_name || buyer.email || "Customer"), phone: buyer.phone || o.buyer_phone || null, city: buyer.city || null, state: buyer.state || null, avatar_url: buyer.avatar_url || null } : o.buyer_phone ? { id: String(o.buyer_id), full_name: "Customer", phone: String(o.buyer_phone), city: null, state: null, avatar_url: null } : null, items: itemsByOrder.get(String(o.id)) ?? [] }; });
}

export async function setSellerOrderStatus(orderId: string, sellerId: string, status: SellerOrderStatus, storeId = sellerId) {
  const { data: products, error: productError } = await supabase.from("products").select("id").or(`vendor_id.eq.${sellerId},user_id.eq.${sellerId},vendor_id.eq.${storeId},user_id.eq.${storeId}`);
  if (productError) logAndThrow("status product lookup failed", productError);
  const ids = (products ?? []).map((p) => String(p.id)); let query = supabase.from("order_items").select("id").eq("order_id", orderId);
  query = ids.length ? query.or(`product_id.in.(${ids.join(",")}),vendor_id.eq.${sellerId},vendor_id.eq.${storeId}`) : query.or(`vendor_id.eq.${sellerId},vendor_id.eq.${storeId}`);
  const { data: line, error: lineError } = await query.limit(1).maybeSingle(); if (lineError) logAndThrow("status order ownership lookup failed", lineError); if (!line) throw new Error("You cannot update an order that does not include your product.");
  const { data, error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId).select("id").maybeSingle();
  if (error) logAndThrow("status update failed", error); if (!data) throw new Error("Order update was not permitted.");
}
