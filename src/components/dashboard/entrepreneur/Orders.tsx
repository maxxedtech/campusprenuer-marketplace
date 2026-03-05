import { useMemo, useState } from "react";
import { readAuth } from "@/lib/authStorage";
import { ordersForSeller, updateOrderStatus, type Order } from "@/lib/ordersStorage";
import { Button } from "@/components/ui/button";

export default function EntrepreneurOrders() {
  const { user } = readAuth();
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState("");

  const orders = useMemo(() => {
    if (!user) return [];
    return ordersForSeller(user.id);
  }, [user, refresh]);

  const setStatus = (orderId: string, status: Order["status"]) => {
    setError("");
    try {
      updateOrderStatus(orderId, status);
      setRefresh((x) => x + 1);
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    }
  };

  if (!user) return null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <p className="text-sm text-gray-600 mt-1">Orders containing your products.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="mt-6 text-gray-600">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o.id.slice(0, 8)}</div>
                <div className="text-sm rounded-full border px-2 py-1">{o.status}</div>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                Customer: {o.customerName} • Total: ₦{o.total.toLocaleString()}
              </div>

              <ul className="mt-3 text-sm list-disc pl-5">
                {o.items
                  .filter((i) => i.sellerId === user.id)
                  .map((i) => (
                    <li key={i.productId}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setStatus(o.id, "confirmed")}>
                  Confirm
                </Button>
                <Button variant="outline" onClick={() => setStatus(o.id, "fulfilled")}>
                  Fulfill
                </Button>
                <Button variant="destructive" onClick={() => setStatus(o.id, "cancelled")}>
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
