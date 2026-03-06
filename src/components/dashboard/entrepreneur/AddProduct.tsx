import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/utils/productStorage";
import { readAuth } from "@/lib/authStorage";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function fileToResizedDataUrl(
  file: File,
  maxSize = 900,
  quality = 0.75
) {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = readAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const previewImages = useMemo(() => images, [images]);

  const handlePickImages = async (files: FileList | null) => {
    setImageError("");

    if (!files || files.length === 0) return;

    const incoming = Array.from(files);

    if (images.length + incoming.length > 10) {
      setImageError("You can upload a maximum of 10 product images.");
      return;
    }

    try {
      const processed: string[] = [];

      for (const file of incoming) {
        if (!file.type.startsWith("image/")) {
          setImageError("Only image files are allowed.");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setImageError("Each image must be 5MB or less.");
          return;
        }

        const resized = await fileToResizedDataUrl(file, 900, 0.75);
        processed.push(resized);
      }

      setImages((prev) => [...prev, ...processed]);
    } catch (e) {
      console.error(e);
      setImageError("Failed to load one or more images. Try again.");
    }
  };

  const removeImageAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImages([]);
    setImageError("");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setImageError("");
    setSaving(true);

    if (!user || user.role !== "entrepreneur") {
      setError("Only an entrepreneur can add products. Please login again.");
      setSaving(false);
      return;
    }

    if (!name.trim() || !price.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    if (images.length === 0) {
      setImageError("Please upload at least one product image.");
      setSaving(false);
      return;
    }

    try {
      addProduct({
        id: makeId(),
        name: name.trim(),
        price: price.trim(),
        imageUrl: images[0],
        images,
        category: category.trim(),
        description: description.trim(),
        seller: user.name,
        sellerId: user.id,
        createdAt: Date.now(),
      });

      setShowSuccess(true);
      resetForm();
      setSaving(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save product.");
      setSaving(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Product saved successfully</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your product has been added and is now available in the marketplace.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2">
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/dashboard/entrepreneur/products");
                }}
              >
                View My Products
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                }}
              >
                Add Another Product
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl md:text-2xl font-semibold">Add Product</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border bg-white p-4 md:p-5"
        >
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11"
          />

          <Input
            placeholder="Price (e.g. 3500)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="h-11"
          />

          <Input
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11"
          />

          <div className="space-y-2">
            <div className="text-sm font-medium">Product Photos * (max 10)</div>

            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePickImages(e.target.files)}
            />

            {imageError ? (
              <div className="text-sm text-red-600">{imageError}</div>
            ) : null}

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="relative overflow-hidden rounded-xl border"
                  >
                    <img
                      src={img}
                      alt={`preview-${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageAt(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500">
              {images.length}/10 image{images.length === 1 ? "" : "s"} selected
            </div>
          </div>

          <textarea
            className="min-h-[120px] w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Button type="submit" className="w-full h-11" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          Note: Images are currently stored in browser storage for demo purposes.
        </div>
      </div>
    </>
  );
}
