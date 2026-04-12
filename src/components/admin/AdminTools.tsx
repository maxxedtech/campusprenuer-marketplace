import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase";

export default function AdminTools() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const loadData = async () => {
    const { data: usersData } = await supabase.from("users").select("*");
    const { data: productsData } = await supabase.from("products").select("*");

    setUsers(usersData || []);
    setProducts(productsData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteUser = async (id: string) => {
    await supabase.from("users").delete().eq("id", id);
    loadData();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* USERS */}
      <div>
        <h2 className="font-semibold mb-3">Users ({users.length})</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between border p-3 rounded">
              <div>
                <p>{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <Button variant="destructive" onClick={() => deleteUser(u.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div>
        <h2 className="font-semibold mb-3">Products ({products.length})</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex justify-between border p-3 rounded">
              <div>
                <p>{p.title}</p>
                <p className="text-xs text-gray-500">₦{p.price}</p>
              </div>
              <Button variant="destructive" onClick={() => deleteProduct(p.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
