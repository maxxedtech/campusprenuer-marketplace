import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft, PackagePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";
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

export default function AddProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fashion & Thrift");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a product title.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price in Naira.");
      return;
    }

    setSaving(true);

    try {
      const user = await getCurrentUser();
      if (!user || user.role !== "entrepreneur") {
        throw new Error("Only entrepreneurs can add products");
      }

      await addProduct({
        title: title.trim(),
        price: Number(price),
        category,
        description: description.trim(),
        image_url: images[0] || "",
      });

      setShowSuccess(true);
      toast.success("Product listed on marketplace! 🚀");
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

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
              Add New Product / Service
            </h1>
            <p className="text-xs text-muted-foreground">
              Create a listing visible to all students across campus.
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-brand-navy">
                Product Published!
              </h2>
              <p className="text-xs text-muted-foreground">
                Your item is now live and students can browse, chat, or add to cart.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => navigate("/dashboard/entrepreneur/products")}
                className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-2xl h-11"
              >
                View My Inventory
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  setTitle("");
                  setPrice("");
                  setDescription("");
                  setImages([]);
                }}
                className="rounded-2xl h-11"
              >
                Add Another Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* IMAGE UPLOADER */}
        <ImageUploader
          images={images}
          onChange={setImages}
          multiple={true}
          maxImages={4}
          label="Product Photos"
          helperText="Upload crisp photos of your product or service artwork (first photo is the cover)"
        />

        {/* TITLE & PRICE */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-gray-700">Product Title</label>
            <Input
              placeholder="e.g. Vintage Oversized Denim Jacket"
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
                placeholder="5,000"
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
          <label className="text-xs font-bold text-gray-700">Description &amp; Specifications</label>
          <textarea
            placeholder="Describe the condition, available sizes/colors, location for pickup, warranty or turnaround time..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-input p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto min-w-[200px] h-12 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl shadow-md shadow-brand-orange/25"
          >
            {saving ? "Publishing..." : "Publish Product (₦)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
