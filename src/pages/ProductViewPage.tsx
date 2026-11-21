import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle, Share2, ShoppingCart, Store } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cartStorage";
import { fetchProductRecordByIdentifier, fetchPublishedProductRecords } from "@/lib/products";
import type { ProductRecord } from "@/types/product";
import { toast } from "sonner";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [related, setRelated] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const nextProduct = await fetchProductRecordByIdentifier(id);
        if (!nextProduct || nextProduct.status !== "published") {
          if (active) setProduct(null);
          return;
        }
        const all = await fetchPublishedProductRecords();
        if (active) {
          setProduct(nextProduct);
          setRelated(all.filter((item) => item.id !== nextProduct.id && item.category_id === nextProduct.category_id).slice(0, 4));
        }
      } catch (loadError: unknown) {
        console.error("Could not load product:", loadError);
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="page-shell py-10"><div className="grid gap-8 lg:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-muted" /><div className="space-y-4"><div className="h-8 w-2/3 animate-pulse rounded bg-muted" /><div className="h-10 w-1/3 animate-pulse rounded bg-muted" /><div className="h-32 animate-pulse rounded-2xl bg-muted" /></div></div></div>;
  if (!product) return <div className="surface-card mx-auto my-12 max-w-md p-8 text-center"><p className="font-bold text-muted-foreground">This product is no longer available.</p><Button className="mt-5" onClick={() => navigate("/marketplace")}>Back to marketplace</Button></div>;

  const price = product.price_kobo / 100;
  const available = product.stock_quantity > 0;
  const handleAddToCart = () => { addToCart(product.id, 1); toast.success(`“${product.title}” added to your cart.`); };
  const handleShare = () => { if (navigator.share) void navigator.share({ title: product.title, text: `Check out ${product.title} on CampusPreneur for ₦${price.toLocaleString()}!`, url: window.location.href }); else { void navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard."); } };

  return <div className="page-shell py-8 sm:py-12"><div className="mx-auto max-w-6xl space-y-8"><div className="flex items-center justify-between"><Button variant="ghost" onClick={() => navigate("/marketplace")}><ArrowLeft /> Back to marketplace</Button><Button variant="outline" size="sm" onClick={handleShare}><Share2 /> Share</Button></div><div className="surface-card grid gap-8 p-5 sm:p-8 md:grid-cols-12"><div className="md:col-span-6"><div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">{product.image_url ? <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Store className="h-16 w-16" /></div>}</div></div><div className="flex flex-col justify-between space-y-6 md:col-span-6"><div className="space-y-5"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-brand-orange">{product.category?.name || "General"}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${available ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>{available ? `${product.stock_quantity} available` : "Unavailable"}</span></div><h1 className="mt-4 text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">{product.title}</h1><p className="mt-2 font-display text-3xl font-black text-brand-orange">₦{price.toLocaleString()}</p></div><div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy font-bold text-white">S</div><div><p className="text-sm font-bold text-brand-navy">Campus seller</p><p className="text-xs text-muted-foreground">Campus pickup</p></div></div><div><h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product details</h2><p className="mt-2 whitespace-pre-line text-sm leading-7 text-foreground">{product.description || "No description provided by the seller."}</p></div></div><div className="space-y-3 border-t border-border pt-4"><div className="grid grid-cols-2 gap-3"><Button onClick={handleAddToCart} disabled={!available} variant="hero" className="h-12"><ShoppingCart /> {available ? "Add to cart" : "Unavailable"}</Button><Button variant="outline" className="h-12" onClick={() => navigate(`/chat-room?seller=${product.vendor_id}&name=Campus%20seller`)}><MessageCircle /> Chat seller</Button></div><p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Agree pickup details directly with the seller.</p></div></div></div>{related.length > 0 && <section><h2 className="font-display text-xl font-semibold text-brand-navy">More from this category</h2><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{related.map((item) => <Link key={item.id} to={`/product/${item.id}`} className="surface-card overflow-hidden p-3"><div className="h-28 overflow-hidden rounded-lg bg-muted">{item.image_url ? <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Store /></div>}</div><h3 className="mt-2 truncate text-sm font-semibold text-brand-navy">{item.title}</h3><p className="text-sm font-bold text-brand-orange">₦{(item.price_kobo / 100).toLocaleString()}</p></Link>)}</div></section>}</div></div>;
}
