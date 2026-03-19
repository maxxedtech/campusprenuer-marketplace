// =============================
// FILE: AdminLayout.jsx
// Replace your current dashboard page with this full layout
// =============================

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Activity, ShoppingCart, Home, Settings } from "lucide-react";

const stats = [
  { title: "Total Users", value: "1,245", icon: Users },
  { title: "Revenue", value: "$8,430", icon: DollarSign },
  { title: "Active Sessions", value: "312", icon: Activity },
  { title: "Orders", value: "578", icon: ShoppingCart },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 text-xl font-bold border-b">Admin Panel</div>

        <nav className="p-4 space-y-4">
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black">
            <Home size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black">
            <Users size={18} /> Users
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black">
            <ShoppingCart size={18} /> Orders
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black">
            <Settings size={18} /> Settings
          </a>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-md rounded-2xl">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h2 className="text-xl font-semibold">{stat.value}</h2>
                  </div>
                  <Icon className="w-8 h-8 text-gray-400" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ===== LOWER SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
              <div className="h-40 flex items-center justify-center text-gray-400">
                Chart coming soon...
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• New user registered</li>
                <li>• Order #1234 placed</li>
                <li>• Payment received</li>
                <li>• Server restarted</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


// =============================
// WHERE TO USE THIS FILE
// =============================

// 1. Replace your current dashboard page file with this component
// Example:
// If you have: pages/admin/dashboard.jsx → replace EVERYTHING with this

// 2. If you're using React Router:
// In your App.jsx, add:

/*
import AdminLayout from "./AdminLayout";

<Route path="/admin" element={<AdminLayout />} />
*/


// =============================
// IMPORTANT (DON'T SKIP)
// =============================

// Make sure you have these installed:
// npm install lucide-react

// If Card component fails:
// You are using shadcn UI → ensure it's installed properly

// =============================
// NEXT STEP (TELL ME WHEN READY)
// =============================

// - Add real charts (very clean graphs)
// - Connect real backend data
// - Add login protection (VERY IMPORTANT)
// - Build users/orders management tables
