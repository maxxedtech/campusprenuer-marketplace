import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";

export default function RequireAuth({ role }: { role?: Role }) {
  const { user, loading } = useAuth();

  // ✅ Important: wait for rehydrate to finish
  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/marketplace" replace />;

  return <Outlet />;
}
