import { Navigate, Route, Routes } from "react-router-dom";

import Index from "@/pages/Index";
import LoginHub from "@/pages/LoginHub";
import Login from "@/pages/Login";
import Marketplace from "@/pages/Marketplace";
import EntrepreneurDashboard from "@/pages/EntrepreneurDashboard";
import AdminPanel from "@/pages/AdminPanel";
import ChatPage from "@/pages/ChatPage";
import SignupCustomer from "@/pages/SignupCustomer";
import SignupEntrepreneur from "@/pages/SignupEntrepreneur";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";
type StoredUser = { role?: Role } | null;

function readAuth() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: StoredUser = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  return { token, user };
}

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
  if (role === "entrepreneur") return <Navigate to="/dashboard/entrepreneur" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/marketplace" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginHub />} />
      <Route path="/login/customer" element={<Login role="customer" />} />
      <Route path="/login/entrepreneur" element={<Login role="entrepreneur" />} />
      <Route path="/signup/customer" element={<SignupCustomer />} />
      <Route path="/signup/entrepreneur" element={<SignupEntrepreneur />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Redirect helper */}
      <Route path="/account" element={<AccountRedirect />} />

      {/* Protected */}
      <Route
        path="/marketplace"
        element={
          <RequireAuth>
            <Marketplace />
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
        path="/dashboard/entrepreneur"
        element={
          <RequireAuth allow={["entrepreneur"]}>
            <EntrepreneurDashboard />
          </RequireAuth>
        }
      />
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
    </Routes>
  );
}
