import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Package, PlusCircle, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@backend/supabase/client";

type SellerProduct = { id: string; title: string; image_url: string | null; images: string[] | null; price_kobo: number; stock_quantity: number; status: string; views_count: number };
type OrderLine = { order_id: string; product_id: string; quantity: number; unit_price_kobo: number };
type OrderRow = { id: string; status: string; total_kobo: number; created_at: string };
type Metrics = { views: number; carts: number; orders: number; units: number; revenue: number; cartByProduct: Map<string, number>; unitsByProduct: Map<string, number> };
const emptyMetrics = (): Metrics => ({ views: 0, carts: 0, orders: 0, units: 0, revenue: 0, cartByProduct: new Map(), unitsByProduct: new Map() });

export default function DashboardHome() {
  const { user, vendorStore } = useAuth(); const [products, setProducts] = useState<SellerProduct[]>([]); const [metrics, setMetrics] = useState<Metrics>(emptyMetrics); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!user || !vendorStore) { setProducts([]); setMetrics(emptyMetrics()); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const { data: productRows, error: productError } = await supabase.from("products").select("id, title, price_kobo, stock_quantity, status, views_count, image_url, images").or(`vendor_id.eq.${user.id},user_id.eq.${user.id},vendor_id.eq.${vendorStore.id},user_id.eq.${vendorStore.id}`).order("created_at", { ascending: false });
      if (productError) throw productError;
      const nextProducts = (productRows ?? []).map((row) => ({ ...row, views_count: Number(row.views_count || 0), images: Array.isArray(row.images) ? row.images : [] })) as SellerProduct[];
      setProducts(nextProducts);
      const next = emptyMetrics(); next.views = nextProducts.reduce((sum, product) => sum + product.views_count, 0);
      const ids = nextProducts.map((product) => product.id);
      if (ids.length) {
        const { data: carts, error: cartError } = await supabase.from("cart_items").select("id, product_id, quantity").in("product_id", ids);
        if (cartError) throw cartError;
        for (const cart of carts ?? []) { const quantity = Number(cart.quantity || 1); next.cartByProduct.set(String(cart.product_id), (next.cartByProduct.get(String(cart.product_id)) || 0) + quantity); next.carts += quantity; }
        const { data: lineRows, error: linesError } = await supabase.from("order_items").select("order_id, product_id, quantity, unit_price_kobo").in("product_id", ids);
        if (linesError) throw linesError;
        const lines = (lineRows ?? []) as OrderLine[]; const orderIds = [...new Set(lines.map((line) => String(line.order_id)))];
        if (orderIds.length) {
          const { data: orderRows, error: orderError } = await supabase.from("orders").select("id, status, total_kobo, created_at").in("id", orderIds);
          if (orderError) throw orderError;
          const orders = (orderRows ?? []) as OrderRow[]; const byId = new Map(orders.map((order) => [order.id, order]));
          const active = orders.filter((order) => !["cancelled", "canceled", "refunded"].includes(order.status)); next.orders = active.length;
          for (const line of lines) { const order = byId.get(String(line.order_id)); if (!order || ["cancelled", "canceled", "refunded"].includes(order.status)) continue; const quantity = Number(line.quantity || 0); next.units += quantity; next.unitsByProduct.set(String(line.product_id), (next.unitsByProduct.get(String(line.product_id)) || 0) + quantity); if (order.status === "delivered" || order.status === "fulfilled") next.revenue += quantity * Number(line.unit_price_kobo || 0); }
        }
      }
      setMetrics(next);
    } catch (loadError) { console.error("[Overview & Analytics] load failed:", loadError instanceof Error ? loadError.message : loadError); setError(loadError instanceof Error ? loadError.message : "Live seller metrics could not be loaded."); }
    finally { setLoading(false); }
  }, [user, vendorStore]);
  useEffect(() => { void load(); if (!vendorStore) return; const channel = supabase.channel(`seller-overview-${vendorStore.id}`).on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `vendor_id=eq.${vendorStore.id}` }, () => void load()).on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => void load()).on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void load()).subscribe(); return () => { void supabase.removeChannel(channel); }; }, [load, vendorStore]);
  const stats = useMemo(() => [{ label: "Total Product Views", value: metrics.views.toLocaleString(), icon: Eye }, { label: "In Customer Carts", value: metrics.carts.toLocaleString(), icon: ShoppingCart }, { label: "Orders · Units Sold", value: `${metrics.orders} · ${metrics.units}`, icon: TrendingUp }, { label: "Total Revenue", value: `₦${(metrics.revenue / 100).toLocaleString()}`, icon: TrendingUp }], [metrics]);
  if (!vendorStore && !loading) return <section className="surface-card space-y-4 p-8"><p className="eyebrow">Overview &amp; Analytics</p><h1 className="page-title text-2xl">Set up your store to view performance</h1><p className="text-sm text-muted-foreground">Store details and guarantor verification are managed in their own section.</p><Button asChild variant="hero"><Link to="/dashboard/entrepreneur/store-setup">Store Setup &amp; Verification</Link></Button></section>;
  return <section className="space-y-6"><header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Seller Studio</p><h1 className="page-title text-2xl">Overview &amp; Analytics</h1><p className="mt-2 text-sm text-muted-foreground">Live product activity, order totals, and delivered revenue.</p></div><Button asChild variant="hero"><Link to="/dashboard/entrepreneur/new"><PlusCircle /> Add New Product</Link></Button></header>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0,1,2,3].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />)}</div> : <><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <article key={label} className="surface-card space-y-3 p-5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p><Icon className="h-4 w-4 shrink-0 text-brand-orange" /></div><p className="font-display text-2xl font-bold text-brand-navy">{value}</p></article>)}</div><div className="surface-card overflow-hidden"><div className="border-b border-border p-5"><h2 className="font-display text-lg font-semibold text-brand-navy">Product performance</h2><p className="mt-1 text-sm text-muted-foreground">Views, live cart quantities, fulfilled sales, inventory, and publication status.</p></div>{products.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr>{["Product","Price","Views","In Carts","Units Sold","Stock Left","Status"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{products.map((product) => <tr key={product.id}><td className="px-4 py-3"><Link to={`/dashboard/entrepreneur/products/${product.id}/edit`} className="flex min-w-48 items-center gap-3 font-semibold text-brand-navy hover:text-brand-orange">{(product.image_url || product.images?.[0]) ? <img src={product.image_url || product.images?.[0]} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <span className="h-11 w-11 rounded-lg bg-muted" />}{product.title}</Link></td><td className="px-4 py-3">₦{(product.price_kobo / 100).toLocaleString()}</td><td className="px-4 py-3">{product.views_count.toLocaleString()}</td><td className="px-4 py-3">{metrics.cartByProduct.get(product.id) || 0}</td><td className="px-4 py-3">{metrics.unitsByProduct.get(product.id) || 0}</td><td className="px-4 py-3">{product.stock_quantity}</td><td className="px-4 py-3"><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold capitalize">{product.status}</span></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-sm text-muted-foreground">No products yet. <Link className="font-semibold text-brand-orange underline" to="/dashboard/entrepreneur/new">Add your first product</Link>.</div>}</div></>}</section>;
}
