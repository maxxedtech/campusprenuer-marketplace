import { Navigate, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";

import AppLayout from "@/components/layout/AppLayout";

import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import EntrepreneurOrders from "@/components/dashboard/entrepreneur/Orders";
import ProductView from "@/pages/ProductView";

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

import AdminLogin from "@/pages/AdminLogin";
import Settings from "@/pages/Settings";

import EntrepreneurDashboard from "@/components/dashboard/EntrepreneurDashboard";
import DashboardHome from "@/components/dashboard/entrepreneur/DashboardHome";
import AddProduct from "@/components/dashboard/entrepreneur/AddProduct";
import MyProducts from "@/components/dashboard/entrepreneur/MyProducts";
import EditProduct from "@/components/dashboard/entrepreneur/EditProduct";
import ProductDetail from "@/components/dashboard/entrepreneur/ProductDetail";

import { ensureAdminSeeded, readAuth } from "@/lib/authStorage";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

function RequireAuth({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { token, user } = readAuth();
  const isLoggedIn = Boolean(token && user);
  const role = (user?.role ?? "unknown") as Role;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/account" replace />;

  return <>{children}</>;
}

function AccountRedirect() {
  const { token, user } = readAuth();
  const isLoggedIn = Boolean(token && user);
  const role = (user?.role ?? "unknown") as Role;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role === "entrepreneur") {
    return <Navigate to="/dashboard/entrepreneur" replace />;
  }
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/marketplace" replace />;
}

export default function App() {
  useEffect(() => {
    ensureAdminSeeded();
  }, []);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup/customer" element={<SignupCustomer />} />
        <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<AccountRedirect />} />

        <Route
          path="/product/:id"
          element={
            <RequireAuth allow={["customer", "entrepreneur"]}>
              <ProductView />
            </RequireAuth>
          }
        />

        <Route
          path="/marketplace"
          element={
            <RequireAuth allow={["customer", "entrepreneur", "admin"]}>
              <Marketplace />
            </RequireAuth>
          }
        />

        <Route
          path="/cart"
          element={
            <RequireAuth allow={["customer", "entrepreneur"]}>
              <Cart />
            </RequireAuth>
          }
        />

        <Route
          path="/orders"
          element={
            <RequireAuth allow={["customer"]}>
              <Orders />
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
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
          <Route path="orders" element={<EntrepreneurOrders />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth allow={["admin"]}>
              <AdminPanel />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
