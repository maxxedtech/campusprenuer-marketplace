import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSellerId, getSellerName } from "@/utils/authStorage";
import {
  getProductById,
  updateProduct,
  Product,
} from "@/utils/productStorage";

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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [product, setProduct] = useState<Product | null>(null);

  // form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setError("");
    setLoading(true);

    if (!id) {
      setError("Missing product ID.");
      setLoading(false);
      return;
    }

    const sellerId = getSellerId();
    if (!sellerId) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const found = getProductById(id);
    if (!found) {
      setError("Product not found.");
      setLoading(false);
      return;
    }

    if (found.sellerId !== sellerId) {
      setError("You are not allowed to edit this product.");
      setLoading(false);
      return;
    }

    setProduct(found);
    setName(found.name || "");
    setPrice(found.price || "");
    setImageDataUrl(found.imageUrl || "");
    setCategory(found.category || "");
    setDescription(found.description || "");
    setLoading(false);
  }, [id]);

  const handlePickImage = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large (max 5MB).");
      return;
    }

    try {
      const resized = await fileToResizedDataUrl(file, 900, 0.75);
      setImageDataUrl(resized);
    } catch (e) {
      console.error(e);
      setError("Failed to load image. Try another one.");
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!product) {
        setError("Product not loaded.");
        setSaving(false);
        return;
      }

      const sellerId = getSellerId();
      if (!sellerId) {
        setError("You are not logged in.");
        setSaving(false);
        return;
      }

      const updated: Product = {
        ...product,
        name: name.trim(),
        price: price.trim(),
        imageUrl: imageDataUrl || "",
        category: category.trim(),
        description: description.trim(),
        seller: getSellerName(),
        sellerId,
      };

      updateProduct(updated);
      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to update product.");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (error && !product) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {error ? (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-3 bg-white p-4 rounded-xl border">
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
          <div className="text-sm font-medium">Product Photo (optional)</div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handlePickImage(e.target.files?.[0] || null)}
          />

          {imageDataUrl ? (
            <div className="border rounded-xl p-2">
              <img
                src={imageDataUrl}
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
          {saving ? "Saving..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
