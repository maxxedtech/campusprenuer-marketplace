import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteProduct,
  getProductsBySeller,
  Product,
} from "@/utils/productStorage";
import { readAuth } from "@/lib/authStorage";

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => {
    const { user, token } = readAuth();

    if (!token || !user) {
      setError("You are not logged in.");
      setProducts([]);
      return;
    }

    if (user.role !== "entrepreneur") {
      setError("Only entrepreneurs can view this page.");
      setProducts([]);
      return;
    }

    setError("");

    const sellerProducts = getProductsBySeller(user.id).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );

    setProducts(sellerProducts);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    deleteProduct(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">My Products</h1>

        <Link to="/dashboard/entrepreneur/add">
          <Button className="w-full sm:w-auto">Add Product</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
          {error}
        </div>
      )}

      {!error && products.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-muted-foreground">
          No products yet. Click <b>Add Product</b> to create your first listing.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {products.map((p) => {
            const displayImage = p.images?.[0] || p.imageUrl || "";

            return (
              <Card key={p.id}>
                <CardContent className="space-y-3 p-4">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={p.name}
                      className="h-44 w-full rounded-lg border object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center rounded-lg border bg-gray-100 text-sm text-muted-foreground">
                      No photo
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      navigate(`/dashboard/entrepreneur/product/${p.id}`)
                    }
                  >
                    View / Chat
                  </Button>

                  <div className="space-y-1">
                    <div className="text-lg font-semibold">{p.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ₦{Number(p.price || 0).toLocaleString()}
                      {p.category ? ` • ${p.category}` : ""}
                    </div>
                  </div>

                  <div className="line-clamp-3 text-sm text-muted-foreground">
                    {p.description}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      to={`/dashboard/entrepreneur/products/${p.id}/edit`}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
