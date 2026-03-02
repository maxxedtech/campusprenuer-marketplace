import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/utils/productStorage";

function makeId() {
  // Works everywhere
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (!user) {
        setSaving(false);
        setError("You are not logged in. Please login again.");
        return;
      }

      const sellerId = user?.email || user?.id || user?.name; // fallback
      if (!sellerId) {
        setSaving(false);
        setError("Your account info is incomplete. Please login again.");
        return;
      }

      addProduct({
        id: makeId(),
        name: name.trim(),
        price: price.trim(),
        imageUrl: imageUrl.trim(),
        category: category.trim(),
        description: description.trim(),
        seller: user?.name || "Entrepreneur",
        sellerId,
        createdAt: Date.now(),
      });

      // quick confirm in console
      console.log("✅ Product saved:", { name, price });

      // go to list
      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      console.error("❌ Save failed:", err);
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
          placeholder="Category (e.g. Fashion, Food)"
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

        {/* ✅ MUST be type="submit" */}
