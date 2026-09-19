import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { readCart, removeFromCart, setQty } from "@/lib/cartStorage";
import { getProductById } from "@/lib/products";
import { placeOrderFromCart } from "@/lib/ordersStorage";
import { getCurrentUser } from "@/lib/auth";
import type { LocalProduct } from "@/types/local";
import { toast } from "sonner";

type CartLine = { product: LocalProduct; qty: number };

export default function CartPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [user, setUser] = useState<any>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const u = await getCurrentUser();
    setUser(u);

    const next: CartLine[] = [];
    for (const item of readCart()) {
      const product = await getProductById(item.productId);
      if (product) next.push({ product, qty: item.qty });
    }
    setLines(next);
    setLoading(false);
  };

  useEffect(() => {
    load();
    window.addEventListener("campus-cart-change", load);
    return () => window.removeEventListener("campus-cart-change", load);
  }, []);

  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  const checkout = async () => {
    if (!lines.length) return;
    setCheckingOut(true);
    try {
      await placeOrderFromCart();
      toast.success("Order placed successfully! 🎉 Seller notified.");
      await load();
      navigate("/marketplace");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Shopping Cart ({lines.length})
          </h1>
          <p className="text-xs text-muted-foreground">
            Review your selected campus items before completing order.
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-brand-orange mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="text-lg font-bold text-brand-navy">Your cart is empty</h2>
              <p className="text-xs text-muted-foreground">
                Discover trending items, textbooks, snacks, fashion, and services from student entrepreneurs.
              </p>
            </div>
            <Button
              asChild
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl px-6"
            >
              <Link to="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* CART ITEMS LIST */}
            <div className="md:col-span-8 space-y-3">
              {lines.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-border flex items-center gap-4 shadow-sm"
                >
                  <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-brand-navy truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Seller: {product.owner_name}
                    </p>
                    <p className="text-sm font-extrabold text-brand-orange mt-1">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-base text-brand-navy border-b border-border pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-brand-navy">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campus Pickup Fee</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center text-sm font-extrabold text-brand-navy">
                  <span>Total Due</span>
                  <span className="text-lg text-brand-orange">₦{total.toLocaleString()}</span>
                </div>

                {/* Delivery Address Preview */}
                {user?.hostel && (
                  <div className="p-3 rounded-2xl bg-muted/40 text-[11px] text-gray-600 space-y-1">
                    <span className="font-bold text-brand-navy flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-orange" /> Delivery Location:
                    </span>
                    <p>{user.hostel}, Room {user.room_number || "N/A"}</p>
                  </div>
                )}

                <Button
                  onClick={checkout}
                  disabled={checkingOut}
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-12 rounded-2xl shadow-md shadow-brand-orange/25"
                >
                  {checkingOut ? "Processing..." : "Confirm & Place Order (₦)"}
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
