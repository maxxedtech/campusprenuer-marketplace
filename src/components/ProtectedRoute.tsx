import { Navigate } from "react-router-dom";
import { readAuth } from "@/lib/authStorage";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

export default function ProtectedRoute({
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
