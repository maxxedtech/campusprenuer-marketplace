// =============================
// ADMIN PANEL (FULL EDIT SYSTEM + ADVANCED CRUD)
// =============================

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trash2, Plus, Pencil, Save } from "lucide-react";

const STORAGE_KEY = "admin_users";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "user" });

  // LOAD
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setUsers(stored);
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // ADD USER
  const addUser = () => {
    if (!name || !email) return;

    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
    };

    setUsers([...users, newUser]);
    setName("");
    setEmail("");
    setRole("user");
  };

  // DELETE
  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // START EDIT
  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditData({ name: user.name, email: user.email, role: user.role });
  };

  // HANDLE EDIT CHANGE
  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // SAVE EDIT
  const saveEdit = (id: number) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, ...editData } : u
    );

    setUsers(updated);
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p>Total Users</p>
              <h2 className="text-xl font-bold">{users.length}</h2>
            </div>
            <Users />
          </CardContent>
        </Card>
      </div>

      {/* ADD USER */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Add User</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={addUser}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> Add User
          </button>
        </CardContent>
      </Card>

      {/* USERS LIST */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Users</h2>

          {users.length === 0 ? (
            <p>No users yet</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div className="w-full max-w-md">
                    {editingId === user.id ? (
                      <div className="space-y-2">
                        <input
                          value={editData.name}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          className="border p-1 rounded w-full"
                        />

                        <input
                          value={editData.email}
                          onChange={(e) => handleEditChange("email", e.target.value)}
                          className="border p-1 rounded w-full"
                        />

                        <select
                          value={editData.role}
                          onChange={(e) => handleEditChange("role", e.target.value)}
                          className="border p-1 rounded w-full"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="text-xs bg-gray-200 px-2 rounded">
                          {user.role}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    {editingId === user.id ? (
                      <button
                        onClick={() => saveEdit(user.id)}
                        className="text-green-600"
                      >
                        <Save size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-500"
                      >
                        <Pencil size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


