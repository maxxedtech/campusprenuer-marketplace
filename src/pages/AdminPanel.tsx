// src/pages/AdminPanel.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    setUsers(data || []);
  };

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  const load = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchProducts()]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 DELETE USER
  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    await supabase.from("users").delete().eq("id", id);
    load();
  };

  // 🔥 DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await supabase.from("products").delete().eq("id", id);
    load();
  };

  // 📊 STATS
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalEntrepreneurs = users.filter(
    (u) => u.role === "entrepreneur"
  ).length;

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent>Total Users: {totalUsers}</CardContent></Card>
        <Card><CardContent>Total Products: {totalProducts}</CardContent></Card>
        <Card><CardContent>Admins: {totalAdmins}</CardContent></Card>
        <Card><CardContent>Entrepreneurs: {totalEntrepreneurs}</CardContent></Card>
      </div>

      {/* 👥 USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Users</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2">Name</th>
              <th className="border px-2">Email</th>
              <th className="border px-2">Role</th>
              <th className="border px-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-2">{u.name}</td>
                <td className="border px-2">{u.email}</td>
                <td className="border px-2">{u.role}</td>
                <td className="border px-2">
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📦 PRODUCTS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Products</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2">Title</th>
              <th className="border px-2">Price</th>
              <th className="border px-2">Owner</th>
              <th className="border px-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border px-2">{p.title}</td>
                <td className="border px-2">₦{p.price}</td>
                <td className="border px-2">{p.owner_name}</td>
                <td className="border px-2">
                  <Button
                    variant="destructive"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
