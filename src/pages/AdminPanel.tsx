import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getUsers, deleteUser, type UserRecord } from "@/utils/userStorage";
import { deleteProductAsAdmin, getProducts } from "@/lib/products";
import type { LocalProduct } from "@/types/local";

export default function AdminPanel() {
  const [users, setUsers] = useState<UserRecord[]>([]); const [products, setProducts] = useState<LocalProduct[]>([]);
  const load = async () => { const current = await getCurrentUser(); if (!current || current.role !== "admin") { window.location.href = "/login"; return; } setUsers(getUsers()); setProducts(await getProducts()); };
  useEffect(() => { load(); }, []);
  const removeUser = (id: string) => { deleteUser(id); load(); }; const removeProduct = (id: string) => { deleteProductAsAdmin(id); load(); };
  return <div className="p-6 space-y-6"><h1 className="text-2xl font-bold">Admin Dashboard</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Card><CardContent>Users: {users.length}</CardContent></Card><Card><CardContent>Products: {products.length}</CardContent></Card><Card><CardContent>Admins: {users.filter((u) => u.role === "admin").length}</CardContent></Card><Card><CardContent>Entrepreneurs: {users.filter((u) => u.role === "entrepreneur").length}</CardContent></Card></div><div><h2>Users</h2>{users.map((u) => <div key={u.id} className="flex justify-between border p-2">{u.name} ({u.role}){u.role !== "admin" && <Button onClick={() => removeUser(u.id)}>Delete</Button>}</div>)}</div><div><h2>Products</h2>{products.map((p) => <div key={p.id} className="flex justify-between border p-2">{p.title}<Button onClick={() => removeProduct(p.id)}>Delete</Button></div>)}</div></div>;
}
