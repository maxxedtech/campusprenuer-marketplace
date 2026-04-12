// src/pages/AdminPanel.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      if (!current || current.role !== "admin") {
        window.location.href = "/login";
        return;
      }

      const { data: users } = await supabase.from("users").select("*");
      const { data: products } = await supabase.from("products").select("*");

      setUsers(users || []);
      setProducts(products || []);
    };

    load();
  }, []);

  const deleteUser = async (id: string) => {
    await supabase.from("users").delete().eq("id", id);
    location.reload();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    location.reload();
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent>Users: {users.length}</CardContent></Card>
        <Card><CardContent>Products: {products.length}</CardContent></Card>
        <Card><CardContent>Admins: {users.filter(u=>u.role==="admin").length}</CardContent></Card>
        <Card><CardContent>Entrepreneurs: {users.filter(u=>u.role==="entrepreneur").length}</CardContent></Card>
      </div>

      <div>
        <h2>Users</h2>
        {users.map(u => (
          <div key={u.id} className="flex justify-between border p-2">
            {u.name} ({u.role})
            <Button onClick={()=>deleteUser(u.id)}>Delete</Button>
          </div>
        ))}
      </div>

      <div>
        <h2>Products</h2>
        {products.map(p => (
          <div key={p.id} className="flex justify-between border p-2">
            {p.title}
            <Button onClick={()=>deleteProduct(p.id)}>Delete</Button>
          </div>
        ))}
      </div>

    </div>
  );
}
