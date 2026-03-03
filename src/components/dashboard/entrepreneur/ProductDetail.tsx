import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product, getProductsBySeller, getAllProducts } from "@/utils/productStorage";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    // get product from all products (or you can filter by seller if needed)
    const allProducts = getAllProducts();
    const found = allProducts.find((p) => p.id === id);

    if (!found) {
      setError("Product not found.");
      return;
    }

    setProduct(found);
  }, [id]);

  if (error) {
    return (
      <div className="p-6 bg-white border rounded-xl text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full max-h-72 object-cover rounded-lg border"
        />
      )}

      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="text-muted-foreground text-sm">
        ₦{product.price} {product.category ? `• ${product.category}` : ""}
      </p>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      {/* ✅ Chat button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate("/chat")}
      >
        Chat with Buyer / Customer
      </Button>
    </div>
  );
}
