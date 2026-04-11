// src/components/dashboard/entrepreneur/MyProducts.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getMyProducts, deleteProduct } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";

export default function MyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError("You are not logged in.");
        setProducts([]);
        return;
      }

      if (user.role !== "entrepreneur") {
        setError("Only entrepreneurs can view this page.");
        setProducts([]);
        return;
      }

      const data = await getMyProducts();

      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      load();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Products</h1>

        <Link to="/dashboard/entrepreneur/add">
          <Button>Add Product</Button>
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-3">

              {p.image_url ? (
                <img
                  src={p.image_url}
                  className="h-40 w-full object-cover rounded"
                />
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}

              <h2 className="font-bold">{p.title}</h2>

              <p>₦{Number(p.price).toLocaleString()}</p>

              <p className="text-sm text-gray-500">{p.description}</p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/dashboard/entrepreneur/products/${p.id}/edit`)
                  }
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
