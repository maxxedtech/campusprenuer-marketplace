import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import Index from "@/pages/Index";
import GetStarted from "@/pages/GetStarted";
import Login from "@/pages/Login";
import Marketplace from "@/pages/Marketplace";
import AdminPanel from "@/pages/AdminPanel";
import ChatPage from "@/pages/ChatPage";
import SignupCustomer from "@/pages/SignupCustomer";
import SignupEntrepreneur from "@/pages/SignupEntrepreneur";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

import ProductDetail from "@/components/dashboard/entrepreneur/ProductDetail";
import EntrepreneurDashboard from "@/components/dashboard/EntrepreneurDashboard";
import DashboardHome from "@/components/dashboard/entrepreneur/DashboardHome";
import AddProduct from "@/components/dashboard/entrepreneur/AddProduct";
import MyProducts from "@/components/dashboard/entrepreneur/MyProducts";
import EditProduct from "@/components/dashboard/entrepreneur/EditProduct";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";
type StoredUser = { role?: Role; name?: string; email?: string } | null;

function readAuth() {
  const userRaw = localStorage.getItem("user");
  let user: StoredUser = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  // Token is optional for now (since you’re doing localStorage auth)
  const token = localStorage.getItem("token");

  const role = (user?.role ?? "unknown") as Role;

  // ✅ Treat user existence as logged in (token optional)
  const isLoggedIn = Boolean(user && role !== "unknown");

  return { token, user, role, isLoggedIn };
}

function RequireAuth({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { isLoggedIn, role } = readAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/account" replace />;

  return <>{children}</>;
}

function AccountRedirect() {
  const { isLoggedIn, role } = readAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role === "entrepreneur") return <Navigate to="/dashboard/entrepreneur" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/marketplace" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ✅ Public */}
        <Route path="/" element={<Index />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup/customer" element={<SignupCustomer />} />
        <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Marketplace should be public so visitors can browse */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Redirect helper */}
        <Route path="/account" element={<AccountRedirect />} />

        {/* ✅ Protected */}
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard/entrepreneur"
          element={
            <RequireAuth allow={["entrepreneur"]}>
              <EntrepreneurDashboard />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth allow={["admin"]}>
              <AdminPanel />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
