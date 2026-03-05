import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/utils/productStorage";
import { readAuth } from "@/lib/authStorage";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Convert image file -> resized base64
async function fileToResizedDataUrl(file: File, maxSize = 900, quality = 0.75) {
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

  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [imageError, setImageError] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const preview = useMemo(() => imageDataUrl || "", [imageDataUrl]);

  const handlePickImage = async (file: File | null) => {
    setImageError("");
    if (!file) {
      setImageDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image too large (max 5MB).");
      return;
    }

    try {
      const resized = await fileToResizedDataUrl(file, 900, 0.75);
      setImageDataUrl(resized);
    } catch (e) {
      console.error(e);
      setImageError("Failed to load image. Try another one.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!user || user.role !== "entrepreneur") {
      setError("Only an entrepreneur can add products. Please login again.");
      setSaving(false);
      return;
    }

    if (!imageDataUrl) {
      setImageError("Please upload at least one product image.");
      setSaving(false);
      return;
    }

    try {
      addProduct({
        id: makeId(),
        name: name.trim(),
        price: price.trim(), // keep your current type
        imageUrl: imageDataUrl,
        category: category.trim(),
        description: description.trim(),
        seller: user.name,
        sellerId: user.id,
        createdAt: Date.now(),
      });

      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save product.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-xl border">
        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        ) : null}

        <Input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          placeholder="Price (e.g. 3500)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <div className="space-y-2">
          <div className="text-sm font-medium">Product Photo *</div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handlePickImage(e.target.files?.[0] || null)}
          />
          {imageError ? <div className="text-sm text-red-600">{imageError}</div> : null}

          {preview ? (
            <div className="border rounded-xl p-2">
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-60 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => setImageDataUrl("")}
              >
                Remove Photo
              </Button>
            </div>
          ) : null}
        </div>

        <Input
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg p-3 min-h-[120px]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Product"}
        </Button>
      </form>

      <div className="text-xs text-muted-foreground">
        Note: Images are saved in your browser storage for now. Later, we’ll move this to a real database/storage.
      </div>
    </div>
  );
}
