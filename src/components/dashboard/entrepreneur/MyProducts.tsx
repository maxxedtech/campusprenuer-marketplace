import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteProduct,
  getProductsBySeller,
  Product,
} from "@/utils/productStorage";
import { getSellerId } from "@/utils/authStorage";

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    const sellerId = getSellerId();
    if (!sellerId) {
      setError("You are not logged in.");
      setProducts([]);
      return;
    }

    setError("");
    const sellerProducts = getProductsBySeller(sellerId);

    // newest first
    sellerProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setProducts(sellerProducts);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: string) => {
    deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Products</h1>

        <Link to="/dashboard/entrepreneur/add">
          <Button>Add Product</Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-muted-foreground">
          No products yet. Click <b>Add Product</b> to create your first listing.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-3">
                {/* ✅ Photo preview */}
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-44 object-cover rounded-lg border"
                    loading="lazy"
                  />
                ) : null}

                <div className="space-y-1">
                  <div className="font-semibold text-lg">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ₦{p.price}
                    {p.category ? ` • ${p.category}` : ""}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-3">
                  {p.description}
                </div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/entrepreneur/products/${p.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>

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
      )}
    </div>
  );
}
