// src/components/dashboard/entrepreneur/AddProduct.tsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";

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

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const previewImages = useMemo(() => images, [images]);

  const handlePickImages = async (files: FileList | null) => {
    if (!files) return;

    const processed: string[] = [];

    for (const file of Array.from(files)) {
      const resized = await fileToResizedDataUrl(file);
      processed.push(resized);
    }

    setImages((prev) => [...prev, ...processed]);
  };

  const removeImageAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const user = await getCurrentUser();

      if (!user || user.role !== "entrepreneur") {
        throw new Error("Only entrepreneurs can add products");
      }

      await addProduct({
        title: name,
        price: Number(price),
        description,
        image_url: images[0] || "",
      });

      setShowSuccess(true);

      setName("");
      setPrice("");
      setDescription("");
      setImages([]);
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl text-center">
            <CheckCircle2 className="mx-auto mb-2 text-green-600" />
            <h2 className="font-bold">Product added successfully</h2>
            <Button onClick={() => navigate("/dashboard/entrepreneur/products")}>
              View Products
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl">
        {error && <div className="text-red-500">{error}</div>}

        <Input placeholder="Product name" value={name} onChange={(e)=>setName(e.target.value)} />
        <Input placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} />

        <Input type="file" multiple onChange={(e)=>handlePickImages(e.target.files)} />

        <div className="grid grid-cols-3 gap-2">
          {previewImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-24 w-full object-cover" />
              <button type="button" onClick={()=>removeImageAt(i)}>
                <X />
              </button>
            </div>
          ))}
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full border p-2"
        />

        <Button disabled={saving}>
          {saving ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </>
  );
}
