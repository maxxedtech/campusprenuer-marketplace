import { useMemo } from "react";
import { readAuth } from "@/lib/authStorage";
import { ordersForCustomer } from "@/lib/ordersStorage";

export default function Orders() {
  const { user } = readAuth();
  const orders = useMemo(() => (user ? ordersForCustomer(user.id) : []), [user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">My Orders</h1>

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
                Total: ₦{o.total.toLocaleString()} • Items: {o.items.length}
              </div>

              <ul className="mt-3 text-sm list-disc pl-5">
                {o.items.map((i) => (
                  <li key={i.productId}>
                    {i.name} × {i.qty}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
