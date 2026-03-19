// src/pages/AdminPanel.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  ownerId: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data: User[] = [];
    snapshot.forEach((d) => data.push({ id: d.id, ...(d.data() as any) }));
    setUsers(data);
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data: Product[] = [];
    snapshot.forEach((d) => data.push({ id: d.id, ...(d.data() as any) }));
    setProducts(data);
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent>Total Users: {users.length}</CardContent></Card>
        <Card><CardContent>Total Products: {products.length}</CardContent></Card>
        <Card><CardContent>Admins: {users.filter(u => u.role === "admin").length}</CardContent></Card>
      </div>

      {/* Users Table */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">Users</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">Name</th>
              <th className="border px-2">Email</th>
              <th className="border px-2">Role</th>
              <th className="border px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="border px-2">{u.name}</td>
                <td className="border px-2">{u.email}</td>
                <td className="border px-2">{u.role}</td>
                <td className="border px-2">
                  <button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Table */}
      <div>
        <h2 className="text-xl mb-2">Products</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">Title</th>
              <th className="border px-2">Price</th>
              <th className="border px-2">Owner</th>
              <th className="border px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="border px-2">{p.title}</td>
                <td className="border px-2">{p.price}</td>
                <td className="border px-2">{p.ownerId}</td>
                <td className="border px-2">
                  <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
