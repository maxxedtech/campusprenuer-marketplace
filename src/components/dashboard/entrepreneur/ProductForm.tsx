import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { removeProductImage, uploadProductImage } from "@/lib/productImages";
import type { ProductCategory, ProductStatus } from "@/types/product";
import { toast } from "sonner";

type ProductRow = {
  id: string;
  vendor_id: string;
  title: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price_kobo: number;
  stock_quantity: number;
  status: ProductStatus;
  image_url: string | null;
};

function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editing = Boolean(id);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const categoryResult = await supabase.from("categories").select("id, name, slug").order("name");
        if (categoryResult.error) throw categoryResult.error;
        if (active) setCategories((categoryResult.data ?? []) as ProductCategory[]);

        if (id) {
          const productResult = await supabase
            .from("products")
            .select("id, vendor_id, title, slug, category_id, description, price_kobo, stock_quantity, status, image_url")
            .eq("id", id)
            .eq("vendor_id", user.id)
            .maybeSingle();
          if (productResult.error) throw productResult.error;
          if (!productResult.data) throw new Error("Product not found or you do not have access to it.");

          const product = productResult.data as ProductRow;
          if (active) {
            setTitle(product.title);
            setSlug(product.slug);
            setCategoryId(product.category_id || "");
            setDescription(product.description || "");
            setPrice(String(product.price_kobo / 100));
            setStockQuantity(String(product.stock_quantity));
            setStatus(product.status);
            setExistingImageUrl(product.image_url || "");
          }
        }
      } catch (loadError: unknown) {
        const message = errorMessage(loadError, "Could not load product form.");
        console.error("Could not load product form:", loadError);
        if (active) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [id, user]);

  if (!user) return <div className="surface-card p-8 text-center text-sm text-muted-foreground">Sign in to manage products.</div>;
  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-7 w-7 animate-spin text-brand-orange" /></div>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const priceKobo = Math.round(Number(price) * 100);
    if (!title.trim() || !categoryId || !Number.isFinite(priceKobo) || priceKobo < 0) {
      setError("Add a title, category, and valid Naira price.");
      return;
    }

    setSaving(true);
    let uploadedImagePath: string | null = null;
    try {
      let imageUrl = existingImageUrl || null;
      if (file) {
        const upload = await uploadProductImage(user.id, file);
        uploadedImagePath = upload.path;
        imageUrl = upload.publicUrl;
      }

      const productPayload = {
        vendor_id: user.id,
        title: title.trim(),
        slug: slug || `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product"}-${Math.random().toString(36).slice(2, 7)}`,
        category_id: categoryId,
        description: description.trim() || null,
        price_kobo: priceKobo,
        stock_quantity: Math.max(0, Math.floor(Number(stockQuantity) || 0)),
        status,
        image_url: imageUrl,
      };

      if (id) {
        const { error: updateError } = await supabase.from("products").update(productPayload).eq("id", id).eq("vendor_id", user.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("products").insert(productPayload);
        if (insertError) throw insertError;
      }

      toast.success(editing ? "Product updated." : "Product saved.");
      navigate("/dashboard/entrepreneur/products");
    } catch (saveError: unknown) {
      if (uploadedImagePath) await removeProductImage(uploadedImagePath);
      const message = errorMessage(saveError, "Could not save product.");
      console.error("Could not save product:", saveError);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => navigate(-1)}><ArrowLeft /></Button>
        <div><p className="eyebrow">Seller inventory</p><h1 className="page-title text-2xl">{editing ? "Edit product" : "Add a product"}</h1><p className="mt-1 text-sm text-muted-foreground">Prices are stored securely as integer kobo in Supabase.</p></div>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="surface-card space-y-6 p-6 sm:p-8">
        <div><label className="field-label" htmlFor="product-title">Title</label><Input id="product-title" value={title} onChange={(event) => setTitle(event.target.value)} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="field-label" htmlFor="product-category">Category</label><select id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
          <div><label className="field-label" htmlFor="product-status">Status</label><select id="product-status" value={status} onChange={(event) => setStatus(event.target.value as ProductStatus)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
          <div><label className="field-label" htmlFor="product-price">Price in Naira</label><Input id="product-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="5000" required /></div>
          <div><label className="field-label" htmlFor="product-stock">Stock quantity</label><Input id="product-stock" type="number" min="0" step="1" value={stockQuantity} onChange={(event) => setStockQuantity(event.target.value)} /></div>
        </div>
        <div><label className="field-label" htmlFor="product-description">Description</label><textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
        <div>
          <div className="flex items-center justify-between"><div><label className="field-label mb-0" htmlFor="product-images">Product image</label><p className="field-help">JPG, PNG, or WEBP · max 5MB · stored in Supabase Storage</p></div><ImagePlus className="h-5 w-5 text-brand-orange" /></div>
          {(file || existingImageUrl) && <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-3"><div className="h-16 w-16 overflow-hidden rounded-md bg-muted">{file ? <span className="flex h-full items-center justify-center p-2 text-center text-[10px]">{file.name}</span> : <img src={existingImageUrl} alt="Current product" className="h-full w-full object-cover" />}</div><p className="text-xs text-muted-foreground">{file ? file.name : "Current image"}</p></div>}
          <Input id="product-images" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-3" />
        </div>
        <div className="flex justify-end"><Button type="submit" variant="hero" disabled={saving}>{saving && <Loader2 className="animate-spin" />}{saving ? "Saving..." : editing ? "Save changes" : "Save product"}</Button></div>
      </form>
    </div>
  );
}
