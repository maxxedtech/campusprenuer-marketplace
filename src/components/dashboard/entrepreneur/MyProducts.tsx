import { useCallback, useEffect, useState } from "react";
import { Edit, Eye, Package, Plus, Store, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { ProductRecord, ProductStatus } from "@/types/product";
import { toast } from "sonner";

export default function MyProducts() {
  const navigate = useNavigate();
  const { user, isVendor, vendorStore } = useAuth();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user || !vendorStore) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from("products").select("id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status, image_url, categories(id, name, slug)").eq("vendor_id", vendorStore.id);
    if (queryError) setError(queryError.message);
    else setProducts((data ?? []).map((row) => { const raw = row as Record<string, unknown>; return { ...(raw as unknown as ProductRecord), image_url: typeof raw.image_url === "string" ? raw.image_url : null, category: raw.categories as ProductRecord["category"], media: [] }; }));
    setLoading(false);
  }, [user, vendorStore]);

  useEffect(() => { void load(); }, [load]);

  if (!isVendor || !user) return null;
  const setStatus = async (product: ProductRecord, status: ProductStatus) => {
    const { error: updateError } = await supabase.from("products").update({ status }).eq("id", product.id).eq("vendor_id", vendorStore.id);
    if (updateError) toast.error(updateError.message); else { toast.success(`Product moved to ${status}.`); await load(); }
  };

  const remove = async (product: ProductRecord) => {
    if (!window.confirm(`Delete “${product.title}”?`)) return;
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id).eq("vendor_id", vendorStore.id);
    if (deleteError) toast.error(deleteError.message); else { toast.success("Product deleted."); await load(); }
  };

  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Seller inventory</p><h1 className="page-title text-2xl">My products ({products.length})</h1><p className="mt-2 text-sm text-muted-foreground">Manage drafts, published products, and archived listings.</p></div><Button onClick={() => navigate("/dashboard/entrepreneur/add")} variant="hero"><Plus /> Add product</Button></div>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{loading ? <div className="flex justify-center p-12"><span className="h-7 w-7 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" /></div> : products.length === 0 ? <div className="surface-card space-y-4 p-12 text-center"><Package className="mx-auto h-10 w-10 text-brand-orange" /><h2 className="font-display text-xl font-semibold text-brand-navy">No products yet</h2><p className="mx-auto max-w-sm text-sm text-muted-foreground">Create a draft product and add images whenever you are ready.</p><Button onClick={() => navigate("/dashboard/entrepreneur/add")} variant="hero">Create first product</Button></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="surface-card overflow-hidden"><div className="relative flex h-44 items-center justify-center bg-muted">{product.image_url ? <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" /> : <Store className="h-10 w-10 text-muted-foreground" />}<span className="absolute left-3 top-3 rounded-full bg-brand-navy px-2.5 py-1 text-xs font-bold capitalize text-white">{product.status}</span></div><div className="space-y-3 p-5"><div><h2 className="line-clamp-1 font-display font-semibold text-brand-navy">{product.title}</h2><p className="mt-1 font-display text-lg font-bold text-brand-orange">₦{(product.price_kobo / 100).toLocaleString()}</p></div><p className="line-clamp-2 text-sm text-muted-foreground">{product.description || "No description provided."}</p><p className="text-xs text-muted-foreground">{product.stock_quantity} in stock · {product.category?.name || "Uncategorized"}</p><div className="flex flex-wrap gap-2 border-t border-border pt-3"><Button asChild size="sm" variant="outline"><Link to={`/product/${product.id}`}><Eye /> View</Link></Button><Button asChild size="sm" variant="outline"><Link to={`/dashboard/entrepreneur/products/${product.id}/edit`}><Edit /> Edit</Link></Button>{product.status === "draft" && <Button size="sm" onClick={() => void setStatus(product, "published")}>Publish</Button>}{product.status === "published" && <Button size="sm" variant="outline" onClick={() => void setStatus(product, "archived")}>Archive</Button>}<Button size="sm" variant="outline" aria-label={`Delete ${product.title}`} onClick={() => void remove(product)} className="text-red-600"><Trash2 /></Button></div></div></article>)}</div>}</div>;
}
