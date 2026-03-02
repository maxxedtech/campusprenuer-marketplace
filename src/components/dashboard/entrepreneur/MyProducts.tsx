import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { deleteProduct, getProductsBySeller, Product } from "@/utils/productStorage";
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
    setProducts(getProductsBySeller(sellerId));
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
      <div className="flex items-center justify-between">
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
        <div className="bg-white border rounded-xl p-6">
          No products yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">₦{p.price}</div>
                <div className="text-xs text-muted-foreground">
                  {p.category || "Uncategorized"}
                </div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/entrepreneur/products/${p.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>

                  <Button variant="destructive" onClick={() => handleDelete(p.id)}>
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
