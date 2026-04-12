import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import GetStarted from "@/pages/GetStarted";
import Login from "@/pages/Login";
import Marketplace from "@/pages/Marketplace";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";
import ChatPage from "@/pages/ChatPage";
import InboxPage from "@/pages/InboxPage";
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

export default function App() {
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

        {/* 🔥 INBOX PAGE */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <InboxPage />
            </ProtectedRoute>
          }
        />

        {/* 🔥 SINGLE CHAT PAGE */}
        <Route
          path="/chat-room"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductViewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}
