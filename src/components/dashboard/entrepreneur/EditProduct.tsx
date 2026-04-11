// src/components/dashboard/entrepreneur/EditProduct.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getCurrentUser } from "@/lib/auth";
import { updateProduct } from "@/lib/products";
import { supabase } from "@/supabase";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [product, setProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 LOAD PRODUCT FROM SUPABASE
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (!id) throw new Error("Missing product ID");

        const user = await getCurrentUser();
        if (!user) throw new Error("Not logged in");

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) throw new Error("Product not found");

        if (data.owner_id !== user.id) {
          throw new Error("You cannot edit this product");
        }

        setProduct(data);
        setName(data.title || "");
        setPrice(String(data.price || ""));
        setImage(data.image_url || "");
        setDescription(data.description || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // 🔥 UPDATE PRODUCT
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!product) throw new Error("No product loaded");

      await updateProduct(product.id, {
        title: name,
        price: Number(price),
        image_url: image,
        description,
      });

      navigate("/dashboard/entrepreneur/products");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error && !product) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-xl space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSave} className="space-y-3">

        <Input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {image && (
          <img
            src={image}
            className="w-full h-40 object-cover rounded"
          />
        )}

        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button disabled={saving}>
          {saving ? "Saving..." : "Update Product"}
        </Button>

      </form>
    </div>
  );
}
