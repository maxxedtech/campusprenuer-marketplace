import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getProducts } from "@/utils/productStorage";
import { addToCart } from "@/lib/cartStorage";
import { readAuth } from "@/lib/authStorage";

function priceToNumber(price: any) {
  const cleaned = String(price ?? "0").replace(/[^\d.]/g, "");
  const n = Number(cleaned || 0);
  return Number.isFinite(n) ? n : 0;
}

export default function ProductView() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = readAuth();

  const product = useMemo(() => {
    const all = getProducts();
    return all.find((p) => p.id === id) || null;
  }, [id]);

  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button className="mt-4" variant="outline" onClick={() => nav("/marketplace")}>
          Back to marketplace
        </Button>
      </div>
    );
  }

  const canAddToCart = user?.role === "customer";

  const onAdd = () => {
    if (!canAddToCart) {
      alert("Only customers can add to cart.");
      return;
    }
    addToCart(product.id, Math.max(1, Math.floor(qty)));
    nav("/cart");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <Button variant="outline" onClick={() => nav("/marketplace")}>
          Back
        </Button>
      </div>

      <p className="text-gray-600 mt-2">₦{priceToNumber(product.price).toLocaleString()}</p>

      <div className="mt-6 rounded-xl border overflow-hidden bg-white">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-h-[360px] object-cover"
          />
        ) : (
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
            No photo
          </div>
        )}

        <div className="p-4">
          {product.category && (
            <div className="text-xs text-muted-foreground mb-2">
              Category: {product.category}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Seller: <b>{product.seller || "Entrepreneur"}</b>
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed">{product.description}</p>
          )}

          <div className="mt-6 flex items-end gap-3">
            <div className="w-28">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <Button onClick={onAdd} disabled={!canAddToCart}>
              Add to cart
            </Button>

            {!canAddToCart && (
              <div className="text-xs text-muted-foreground">
                Login as a customer to add to cart.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
