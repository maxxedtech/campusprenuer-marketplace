// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const { user } = useAuth();
  const loading = false;

  // 🔄 Loading state (prevents flicker)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm">Checking authentication...</p>
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
