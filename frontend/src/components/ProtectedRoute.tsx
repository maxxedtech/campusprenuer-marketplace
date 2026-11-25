// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "entrepreneur" | "customer" | "admin";

export default function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: Role[];
}) {
  const { user, loading } = useAuth();

  // 🔄 Loading state (prevents flicker)
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role restriction
  if (allow && !allow.includes(user.role)) {
    if (user.role === "entrepreneur") {
      return <Navigate to="/dashboard/entrepreneur" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/marketplace" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
}
