// src/pages/Cart.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readProducts } from "@/lib/productsStorage";
import { cartTotal, readCart, removeFromCart, setQty } from "@/lib/cartStorage";
import { placeOrderFromCart } from "@/lib/ordersStorage";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const nav = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const products = useMemo(() => readProducts(), [refresh]);
  const cart = useMemo(() => readCart(), [refresh]);

  const lines = cart
    .map((c) => ({
      item: c,
      product: products.find((p) => p.id === c.productId) || null,
    }))
    .filter((x) => x.product);

  const total = useMemo(() => cartTotal(products), [products, refresh]);

  const bump = () => setRefresh((x) => x + 1);

  const checkout = async () => {
    setError("");
    setLoading(true);
    try {
      const order = placeOrderFromCart();
      nav(`/orders`, { replace: true });
      console.log("Order placed:", order);
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
      bump();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Cart</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {lines.length === 0 ? (
        <p className="mt-6 text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {lines.map(({ item, product }: any) => (
            <div key={item.productId} className="rounded-xl border p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold truncate">{product.title}</div>
                <div className="text-sm text-gray-600">₦{product.price.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Seller: {product.ownerName}</div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => {
                    setQty(item.productId, Number(e.target.value));
                    bump();
                  }}
                  className="w-20"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    removeFromCart(item.productId);
                    bump();
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-semibold">Total: ₦{total.toLocaleString()}</div>
            <Button disabled={loading} onClick={checkout}>
              {loading ? "Placing order..." : "Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
