import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/utils/productStorage";
import { getSellerId, getSellerName } from "@/utils/authStorage";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const sellerId = getSellerId();
      if (!sellerId) {
        setError("You are not logged in. Please login again.");
        setSaving(false);
        return;
      }

      addProduct({
        id: makeId(),
        name: name.trim(),
        price: price.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim(),
        description: description.trim(),
        seller: getSellerName(),
        sellerId,
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

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 rounded-xl border"
      >
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

        <Input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

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
    </div>
  );
}
