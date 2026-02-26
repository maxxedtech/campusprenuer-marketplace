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
const queryClient = new QueryClient();
import ResetPassword from "@/pages/ResetPassword";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter><Routes>
  <Route element={<AppLayout />}>
    <Route path="/" element={<Index />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
          
<Route path="/login/customer" element={<Login role="customer" />} />
<Route path="/login/entrepreneur" element={<Login role="entrepreneur" />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />   {/* ✅ ADD THIS */}
  <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
  <Route path="/signup/customer" element={<SignupCustomer />} />
  <Route path="*" element={<NotFound />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} /> 
</Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
