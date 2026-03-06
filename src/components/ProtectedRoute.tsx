import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

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

export default function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: Role[];
}) {
  const { token, user } = readAuth();
  const isLoggedIn = Boolean(token && user);
  const role = (user?.role ?? "unknown") as Role;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !allow.includes(role)) {
    if (role === "entrepreneur") {
      return <Navigate to="/dashboard/entrepreneur" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
}
