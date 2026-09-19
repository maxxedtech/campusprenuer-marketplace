import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { updateProduct, getProductById, deleteProduct } from "@/lib/products";
import ImageUploader from "@/components/common/ImageUploader";
import { toast } from "sonner";

const CATEGORIES = [
  "Tech & Gadgets",
  "Fashion & Thrift",
  "Food & Treats",
  "Services & Design",
  "Books & Academics",
  "Beauty & Grooming",
  "Campus Essentials",
  "General",
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (!id) throw new Error("Missing product ID");

        const user = await getCurrentUser();
        if (!user) throw new Error("Not logged in");

        const data = await getProductById(id);
        if (!data) throw new Error("Product not found");

        if (data.owner_id !== user.id && user.role !== "admin") {
          throw new Error("You cannot edit this product");
        }

        setTitle(data.title || "");
        setPrice(String(data.price || ""));
        setCategory(data.category || "General");
        setImages(data.image_url ? [data.image_url] : []);
        setDescription(data.description || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");

    try {
      await updateProduct(id, {
        title: title.trim(),
        price: Number(price),
        category,
        image_url: images[0] || "",
        description: description.trim(),
      });

      toast.success("Product updated successfully! ✅");
      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      setError(err.message || "Update failed");
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this listing permanently?")) return;
    setDeleting(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted.");
      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-border text-center space-y-4">
        <p className="text-red-500 font-bold">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-navy">
              Edit Product Listing
            </h1>
            <p className="text-xs text-muted-foreground">
              Update photos, price, category or item descriptions.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleting}
          className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold gap-1.5 rounded-2xl"
        >
          <Trash2 className="w-4 h-4" />
          Delete Listing
        </Button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
        {/* IMAGE UPLOADER */}
        <ImageUploader
          images={images}
          onChange={setImages}
          multiple={false}
          label="Product Photo"
          helperText="Upload a clear image of your item"
        />

        {/* TITLE & PRICE */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-gray-700">Product Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Price (₦ Naira)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">
                ₦
              </span>
              <Input
                type="number"
                min="0"
                step="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8 h-11 rounded-xl font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-input p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
          />
        </div>

        {/* BUTTONS */}
        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-2xl h-12 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white font-bold rounded-2xl h-12 px-8 shadow-md"
          >
            {saving ? "Saving Changes..." : "Save Changes (₦)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
