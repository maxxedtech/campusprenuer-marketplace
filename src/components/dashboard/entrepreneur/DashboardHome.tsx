import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase";

export default function DashboardHome() {
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("owner_id", user.id);

      setProducts(data || []);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Welcome, {user?.name}
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <div className="p-4 border rounded-xl">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-xl font-bold">{products.length}</p>
        </div>

        <div className="p-4 border rounded-xl">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-xl font-bold text-green-600">
            Active
          </p>
        </div>

      </div>

      {/* PRODUCTS */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Your Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No products yet. Start adding!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border p-4 rounded-xl">

                <p className="font-semibold">
                  {p.title}
                </p>

                <p className="text-sm text-gray-500">
                  ₦{Number(p.price).toLocaleString()}
                </p>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
