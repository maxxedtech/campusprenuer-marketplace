// src/App.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import GetStarted from "@/pages/GetStarted";
import Login from "@/pages/Login";
import Marketplace from "@/pages/Marketplace";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";
import ChatPage from "@/pages/ChatPage";
import SignupCustomer from "@/pages/SignupCustomer";
import SignupEntrepreneur from "@/pages/SignupEntrepreneur";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import CartPage from "@/pages/CartPage";
import ProductViewPage from "@/pages/ProductViewPage";

import EntrepreneurDashboard from "@/components/dashboard/EntrepreneurDashboard";
import DashboardHome from "@/components/dashboard/entrepreneur/DashboardHome";
import AddProduct from "@/components/dashboard/entrepreneur/AddProduct";
import MyProducts from "@/components/dashboard/entrepreneur/MyProducts";
import EditProduct from "@/components/dashboard/entrepreneur/EditProduct";
import ProductDetail from "@/components/dashboard/entrepreneur/ProductDetail";

import { getCurrentUser } from "@/lib/auth";

// 🔥 NEW: Supabase-based redirect
function AccountRedirect() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "entrepreneur") {
    return <Navigate to="/dashboard/entrepreneur" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/marketplace" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Index />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup/customer" element={<SignupCustomer />} />
        <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* AUTO ROLE REDIRECT */}
        <Route path="/account" element={<AccountRedirect />} />

        {/* MARKETPLACE */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT VIEW */}
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductViewPage />
            </ProtectedRoute>
          }
        />

        {/* CART (CUSTOMER ONLY) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* ENTREPRENEUR DASHBOARD */}
        <Route
          path="/dashboard/entrepreneur"
          element={
            <ProtectedRoute allow={["entrepreneur"]}>
              <EntrepreneurDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}
