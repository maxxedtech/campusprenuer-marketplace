import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";

export default function RequireAuth({ allow }: { allow?: Role[] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allow && !allow.includes(user.role)) return <Navigate to="/account" replace />;

  return <Outlet />;
}
