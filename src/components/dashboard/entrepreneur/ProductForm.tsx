import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { uploadProductImageToCloudinary } from "@/lib/cloudinary";
import type { ProductCategory, ProductMedia, ProductRecord, ProductStatus } from "@/types/product";
import { toast } from "sonner";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const randomSuffix = () => Math.random().toString(36).slice(2, 7);

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, vendorStore, isVendor } = useAuth();
  const editing = Boolean(id);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [existingMedia, setExistingMedia] = useState<ProductMedia[]>([]);
  const [removedMedia, setRemovedMedia] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!isVendor || !user) { setLoading(false); return; }
      try {
        const categoryResult = await supabase.from("categories").select("id, name, slug").eq("is_active", true).order("name");
        if (categoryResult.error) throw categoryResult.error;
        if (active) setCategories((categoryResult.data ?? []) as ProductCategory[]);
        if (id) {
          const productResult = await supabase.from("products").select("id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status").eq("id", id).eq("vendor_id", vendorStore?.id || "").maybeSingle();
          if (productResult.error) throw productResult.error;
          if (!productResult.data) throw new Error("Product not found or you do not have access to it.");
          const product = productResult.data as ProductRecord;
          const mediaResult = await supabase.from("product_media").select("id, product_id, public_id, secure_url, resource_type, format, width, height, bytes, folder, sort_order, deleted_at").eq("product_id", id).is("deleted_at", null).order("sort_order");
          if (mediaResult.error) throw mediaResult.error;
          if (active) { setTitle(product.title); setSlug(product.slug); setCategoryId(product.category_id || ""); setDescription(product.description || ""); setPrice(String(product.price_kobo / 100)); setStockQuantity(String(product.stock_quantity)); setStatus(product.status); setExistingMedia((mediaResult.data ?? []) as ProductMedia[]); }
        }
      } catch (loadError: unknown) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load product form.");
      } finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [id, isVendor, user, vendorStore?.id]);

  if (!isVendor || !user) return <div className="surface-card p-8 text-center text-sm text-muted-foreground">Only vendor accounts can manage products.</div>;
  if (!vendorStore) return <div className="surface-card p-8 text-center"><h1 className="font-display text-xl font-semibold text-brand-navy">Create your store first</h1><p className="mt-2 text-sm text-muted-foreground">Your vendor store must exist before products can be attached to it.</p><Button className="mt-5" onClick={() => navigate("/dashboard/entrepreneur")}>Back to seller dashboard</Button></div>;
  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-7 w-7 animate-spin text-brand-orange" /></div>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const priceKobo = Math.round(Number(price) * 100);
    if (!title.trim() || !categoryId || !Number.isFinite(priceKobo) || priceKobo < 0) { setError("Add a title, category, and valid Naira price."); return; }
    setSaving(true);
    try {
      const productPayload = { vendor_id: vendorStore.id, title: title.trim(), slug: slug || `${slugify(title) || "product"}-${randomSuffix()}`, category_id: categoryId, description: description.trim(), price_kobo: priceKobo, stock_quantity: Math.max(0, Math.floor(Number(stockQuantity) || 0)), status };
      let productId = id;
      if (productId) {
        const { error: updateError } = await supabase.from("products").update({ ...productPayload, updated_at: new Date().toISOString() }).eq("id", productId).eq("vendor_id", vendorStore.id);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase.from("products").insert(productPayload).select("id").single();
        if (insertError) throw insertError;
        productId = String(data.id);
      }
      if (removedMedia.length) {
        const { error: mediaError } = await supabase.from("product_media").update({ deleted_at: new Date().toISOString() }).in("id", removedMedia).eq("product_id", productId);
        if (mediaError) throw mediaError;
      }
      if (files.length && productId) {
        const uploads = await Promise.all(files.map((file) => uploadProductImageToCloudinary(file)));
        const mediaRows = uploads.map((upload, index) => ({ product_id: productId, owner_id: user.id, public_id: upload.public_id, secure_url: upload.secure_url, resource_type: upload.resource_type, format: upload.format, width: upload.width, height: upload.height, bytes: upload.bytes, folder: upload.folder || upload.asset_folder || null, sort_order: existingMedia.length + index }));
        const { error: mediaError } = await supabase.from("product_media").insert(mediaRows);
        if (mediaError) throw mediaError;
      }
      toast.success(editing ? "Product updated." : "Product saved.");
      navigate("/dashboard/entrepreneur/products");
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save product.");
    } finally { setSaving(false); }
  };

  return <div className="max-w-3xl space-y-6"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" aria-label="Go back" onClick={() => navigate(-1)}><ArrowLeft /></Button><div><p className="eyebrow">Seller inventory</p><h1 className="page-title text-2xl">{editing ? "Edit product" : "Add a product"}</h1><p className="mt-1 text-sm text-muted-foreground">Prices are stored securely as integer kobo in Supabase.</p></div></div>{vendorStore.status !== "approved" && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Your store is <strong>{vendorStore.status}</strong>. You can save drafts now, but products will only appear publicly after store approval.</div>}{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="surface-card space-y-6 p-6 sm:p-8"><div><label className="field-label" htmlFor="product-title">Title</label><Input id="product-title" value={title} onChange={(event) => setTitle(event.target.value)} required /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="product-category">Category</label><select id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div><label className="field-label" htmlFor="product-status">Status</label><select id="product-status" value={status} onChange={(event) => setStatus(event.target.value as ProductStatus)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div><div><label className="field-label" htmlFor="product-price">Price in Naira</label><Input id="product-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="5000" required /></div><div><label className="field-label" htmlFor="product-stock">Stock quantity</label><Input id="product-stock" type="number" min="0" step="1" value={stockQuantity} onChange={(event) => setStockQuantity(event.target.value)} /></div></div><div><label className="field-label" htmlFor="product-description">Description</label><textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div><div><div className="flex items-center justify-between"><div><label className="field-label mb-0" htmlFor="product-images">Product images</label><p className="field-help">JPG, PNG, or WEBP · max 5MB each</p></div><ImagePlus className="h-5 w-5 text-brand-orange" /></div><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{existingMedia.map((media) => <div key={media.id} className="relative aspect-square overflow-hidden rounded-lg border border-border"><img src={media.secure_url} alt="Existing product" className="h-full w-full object-cover" /><button type="button" aria-label="Remove existing image" onClick={() => { setRemovedMedia((current) => [...current, media.id]); setExistingMedia((current) => current.filter((item) => item.id !== media.id)); }} className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}{files.map((file) => <div key={`${file.name}-${file.lastModified}`} className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-brand-orange bg-orange-50 p-2 text-center text-xs text-brand-navy">{file.name}</div>)}</div><Input id="product-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} className="mt-3" /></div><div className="flex justify-end"><Button type="submit" variant="hero" disabled={saving}>{saving && <Loader2 className="animate-spin" />}{saving ? "Saving..." : editing ? "Save changes" : "Save product"}</Button></div></form></div>;
}
