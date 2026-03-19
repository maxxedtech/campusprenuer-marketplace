import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Activity,
  ShoppingCart,
  Home,
  Settings,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// =============================
// SAMPLE DATA (REPLACE LATER WITH API)
// =============================

const stats = [
  { title: "Total Users", value: "1,245", icon: Users },
  { title: "Revenue", value: "$8,430", icon: DollarSign },
  { title: "Active Sessions", value: "312", icon: Activity },
  { title: "Orders", value: "578", icon: ShoppingCart },
];

const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 700 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 900 },
  { name: "May", sales: 650 },
];

const userData = [
  { name: "Mon", users: 30 },
  { name: "Tue", users: 50 },
  { name: "Wed", users: 40 },
  { name: "Thu", users: 70 },
  { name: "Fri", users: 60 },
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

        {/* ===== CHARTS SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SALES LINE CHART */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* USERS BAR CHART */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">User Growth</h2>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== ACTIVITY ===== */}
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
      </main>
    </div>
  );
}

