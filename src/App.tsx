import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import RequireAuth from "@/components/RequireAuth";

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

import { useAuth } from "@/contexts/AuthContext";

function AccountRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "entrepreneur") return <Navigate to="/dashboard/entrepreneur" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
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

        {/* ✅ Marketplace is PUBLIC */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Redirect helper */}
        <Route path="/account" element={<AccountRedirect />} />

        {/* ✅ Protected: Chat */}
        <Route element={<RequireAuth />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        {/* ✅ Protected: Entrepreneur Dashboard */}
        <Route element={<RequireAuth allow={["entrepreneur"]} />}>
          <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>
        </Route>

        {/* ✅ Protected: Admin */}
        <Route element={<RequireAuth allow={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
