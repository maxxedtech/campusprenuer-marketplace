import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Product } from "@/utils/productStorage";
import {
  getAllProducts,
  getProductById,
  getProductsBySeller,
} from "@/utils/productStorage";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    // Load product
    const found = getProductById(id);
    setProduct(found);
    setLoading(false);
  }, [id]);

  const moreFromSeller = useMemo(() => {
    if (!product) return [];

    // Example: show up to 4 other products by same seller
    const sellerProducts = getProductsBySeller(product.sellerId);

    return sellerProducts
      .filter((p) => p.id !== product.id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4);
  }, [product]);

  // (Optional) If you need all products somewhere:
  // const all = getAllProducts();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-6">
        <p className="mb-4">Product not found.</p>
        <Button asChild>
          <Link to="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl overflow-hidden border bg-white">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-[360px] object-cover"
            loading="lazy"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-lg mt-2 font-semibold">₦{product.price}</p>

          {product.category ? (
            <p className="mt-2 text-sm opacity-80">Category: {product.category}</p>
          ) : null}

          <div className="mt-4">
            <p className="font-medium">Description</p>
            <p className="mt-1 opacity-90">{product.description}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button>Chat Seller</Button>
            <Button variant="outline" asChild>
              <Link to="/marketplace">Back</Link>
            </Button>
          </div>

          <div className="mt-6 text-sm opacity-80">
            <p>Seller: {product.seller}</p>
          </div>
        </div>
      </div>

      {moreFromSeller.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">More from this seller</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreFromSeller.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition"
              >
                <img
                  src={p.imageUrl || "/placeholder.svg"}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="font-medium line-clamp-1">{p.name}</p>
                  <p className="text-sm opacity-80 mt-1">₦{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
