import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getUsers, deleteUser, type UserRecord } from "@/utils/userStorage";
import { deleteProductAsAdmin, getProducts } from "@/lib/products";
import type { LocalProduct } from "@/types/local";

export default function AdminTools() { const [users, setUsers] = useState<UserRecord[]>([]); const [products, setProducts] = useState<LocalProduct[]>([]); const load = async () => { setUsers(getUsers()); setProducts(await getProducts()); }; useEffect(() => { load(); }, []); return <div className="max-w-6xl mx-auto p-6 space-y-10"><h1 className="text-2xl font-bold">Admin Panel</h1><div><h2 className="font-semibold mb-3">Users ({users.length})</h2>{users.map((u) => <div key={u.id} className="flex justify-between border p-3 rounded"><div><p>{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>{u.role !== "admin" && <Button variant="destructive" onClick={() => { deleteUser(u.id); load(); }}>Delete</Button>}</div>)}</div><div><h2 className="font-semibold mb-3">Products ({products.length})</h2>{products.map((p) => <div key={p.id} className="flex justify-between border p-3 rounded"><div><p>{p.title}</p><p className="text-xs text-gray-500">₦{p.price}</p></div><Button variant="destructive" onClick={() => { deleteProductAsAdmin(p.id); load(); }}>Delete</Button></div>)}</div></div>; }
