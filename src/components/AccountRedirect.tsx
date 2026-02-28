import { Navigate } from "react-router-dom";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";
type StoredUser = { role?: Role };

function readAuth() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: StoredUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  const isLoggedIn = Boolean(token && user);
  const role = (user?.role as Role) || "unknown";

  return { isLoggedIn, role };
}

export default function AccountRedirect() {
  const { isLoggedIn, role } = readAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "entrepreneur")
    return <Navigate to="/dashboard/entrepreneur" replace />;

  // customer or unknown
  return <Navigate to="/marketplace" replace />;
}
