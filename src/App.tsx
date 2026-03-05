// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

// pages
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminLogin from "@/pages/AdminLogin";
import Settings from "@/pages/Settings";

// Replace these with your real pages if you already have them:
function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">CampusPrenuer</h1>
      <p className="text-gray-600 mt-2">Buy, sell, and connect on campus.</p>
    </div>
  );
}
function Marketplace() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <p className="text-gray-600 mt-2">Your listings will show here.</p>
    </div>
  );
}
function EntrepreneurDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Entrepreneur Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage your products and orders here.</p>
    </div>
  );
}
function AdminPanel() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="text-gray-600 mt-2">Restricted.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* secret admin route */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* protected routes */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
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
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
