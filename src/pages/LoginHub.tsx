import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "@/pages/Login";
import { Button } from "@/components/ui/button";

type Role = "customer" | "entrepreneur";

const LAST_LOGIN_ROLE_KEY = "last-login-role";

function readRoleFromQuery(search: string): Role | null {
  const params = new URLSearchParams(search);
  const role = params.get("role");
  if (role === "customer" || role === "entrepreneur") return role;
  return null;
}

export default function LoginHub() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = useMemo<Role>(() => {
    const fromQuery = readRoleFromQuery(location.search);
    if (fromQuery) return fromQuery;

    const stored = localStorage.getItem(LAST_LOGIN_ROLE_KEY);
    if (stored === "customer" || stored === "entrepreneur") return stored;

    return "customer";
  }, [location.search]);

  const [role, setRole] = useState<Role>(initialRole);

  useEffect(() => {
    localStorage.setItem(LAST_LOGIN_ROLE_KEY, role);
  }, [role]);

  // Optional: keep URL clean but still allow direct deep links
  useEffect(() => {
    // If someone hits /login/customer or /login/entrepreneur, it still works.
    // /login stays a hub page.
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Choose how you want to log in
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button
            type="button"
            variant={role === "customer" ? "default" : "outline"}
            onClick={() => setRole("customer")}
          >
            Customer
          </Button>

          <Button
            type="button"
            variant={role === "entrepreneur" ? "default" : "outline"}
            onClick={() => setRole("entrepreneur")}
          >
            Entrepreneur
          </Button>
        </div>

        {/* Reuse your existing Login page (it expects a role prop) */}
        <Login role={role} />

        <div className="mt-5 text-sm text-muted-foreground flex flex-col gap-2">
          <button
            className="text-left underline hover:text-foreground"
            onClick={() =>
              navigate(role === "customer" ? "/signup/customer" : "/signup/entrepreneur")
            }
          >
            New here? Create an account
          </button>

          <button
            className="text-left underline hover:text-foreground"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
