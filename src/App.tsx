import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import AppLayout from "@/components/layout/AppLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import SignupEntrepreneur from "./pages/SignupEntrepreneur";
import SignupCustomer from "./pages/SignupCustomer";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import Marketplace from "./pages/Marketplace";
import ChatPage from "./pages/ChatPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// ✅ NEW: wrapper pages/components
import LoginHub from "@/pages/LoginHub";
import AccountRedirect from "@/components/auth/AccountRedirect";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* MAIN APP LAYOUT */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />

              {/* If you want these public, leave as-is.
                  If you want only logged-in users, wrap with ProtectedRoute too. */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/chat" element={<ChatPage />} />

              {/* ✅ Protected: Entrepreneur-only */}
              <Route
                path="/dashboard/entrepreneur"
                element={
                  <ProtectedRoute allow={["entrepreneur"]}>
                    <EntrepreneurDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ✅ Protected: Admin-only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allow={["admin"]}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ✅ Professional login flow */}
            <Route path="/login" element={<LoginHub />} />
            <Route path="/login/customer" element={<Login role="customer" />} />
            <Route
              path="/login/entrepreneur"
              element={<Login role="entrepreneur" />}
            />

            {/* ✅ Smart account route */}
            <Route path="/account" element={<AccountRedirect />} />

            {/* SIGNUP */}
            <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
            <Route path="/signup/customer" element={<SignupCustomer />} />

            {/* Optional alias to prevent navbar 404s */}
            <Route path="/get-started" element={<SignupCustomer />} />

            {/* PASSWORD */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
