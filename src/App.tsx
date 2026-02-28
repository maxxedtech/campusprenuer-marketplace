```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

              <Route path="/marketplace" element={<Marketplace />} />

              <Route
                path="/dashboard/entrepreneur"
                element={<EntrepreneurDashboard />}
              />

              <Route path="/chat" element={<ChatPage />} />

              <Route path="/admin" element={<AdminPanel />} />

            </Route>


            {/* LOGIN ROUTES */}
            <Route path="/login/customer" element={<Login role="customer" />} />
            <Route path="/login/entrepreneur" element={<Login role="entrepreneur" />} />

            {/* this fixes navbar /login link */}
            <Route path="/login" element={<Navigate to="/login/customer" replace />} />


            {/* SIGNUP ROUTES */}
            <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
            <Route path="/signup/customer" element={<SignupCustomer />} />

            {/* this fixes navbar /get-started */}
            <Route path="/get-started" element={<Navigate to="/signup/customer" replace />} />


            {/* PASSWORD RESET */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* ACCOUNT REDIRECT (since /account doesn't exist) */}
            <Route path="/account" element={<Navigate to="/marketplace" replace />} />


            {/* 404 PAGE */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
```
