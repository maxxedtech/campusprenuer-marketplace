import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearSession, readUsers, writeUsers } from "@/lib/authStorage";
import { getProducts, saveProducts } from "@/utils/productStorage";
import { readOrders } from "@/lib/ordersStorage";

const RESET_TOKEN = "CAMPUSPRENUER_RESET_2026";

export default function AdminTools() {
  const [refresh, setRefresh] = useState(0);

  const users = useMemo(() => readUsers(), [refresh]);
  const products = useMemo(() => getProducts(), [refresh]);
  const orders = useMemo(() => readOrders(), [refresh]);

  const bump = () => setRefresh((x) => x + 1);

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    if (target.role === "admin") {
      alert("Admin account cannot be deleted.");
      return;
    }

    writeUsers(users.filter((u) => u.id !== id));
    bump();
  };

  const updateUserBadge = (id: string, badge: "" | "verified" | "special") => {
    const next = users.map((u) =>
      u.id === id
        ? {
            ...u,
            badge,
            verified: badge === "verified" || badge === "special",
          }
        : u
    );

    writeUsers(next);
    bump();
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter((p) => p.id !== id));
    bump();
  };

  const resetAll = () => {
    const token = window.prompt(
      "Enter admin reset token to delete all users, products, orders and carts:"
    );

    if (!token) return;

    if (token !== RESET_TOKEN) {
      alert("Invalid token. Reset cancelled.");
      return;
    }

    const adminUsers = users.filter((u) => u.role === "admin");
    writeUsers(adminUsers);

    localStorage.removeItem("campusprenuer_products");
    localStorage.removeItem("campusprenuer_orders");

    Object.keys(localStorage)
      .filter((k) => k.startsWith("cp_cart_"))
      .forEach((k) => localStorage.removeItem(k));

    clearSession();
    alert("System reset completed. Admin account was preserved.");
    bump();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Tools</h1>

      <div className="mt-4">
        <Button variant="destructive" onClick={resetAll}>
          Reset demo data
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold">Users ({users.length})</h2>
          <div className="mt-3 space-y-3">
            {users.map((u) => (
              <div key={u.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.name}</div>
                    <div className="text-xs text-gray-600 truncate">
                      {u.email} • {u.role}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Badge: {u.badge || "none"}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => deleteUser(u.id)}
                    disabled={u.role === "admin"}
                  >
                    Delete
                  </Button>
                </div>

                {u.role !== "admin" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserBadge(u.id, "verified")}
                    >
                      Give Verified
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserBadge(u.id, "special")}
                    >
                      Give Special
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserBadge(u.id, "")}
                    >
                      Remove Badge
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-semibold">Products ({products.length})</h2>
          <div className="mt-3 space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-gray-600 truncate">
                    ₦{String(p.price)} • seller: {p.seller}
                  </div>
                </div>
                <Button variant="outline" onClick={() => deleteProduct(p.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Orders ({orders.length})</h2>
        <p className="mt-1 text-sm text-gray-600">
          Orders exist in localStorage only (demo).
        </p>
      </div>
    </div>
  );
}
