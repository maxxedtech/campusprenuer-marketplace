import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";
type StoredUser = { name?: string; email?: string; role?: Role };

function readUser(): StoredUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function getDisplayName(email: string) {
  const left = email.split("@")[0] || "Account";
  // make it look nicer than raw email
  return left
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) throw new Error("Enter email and password");

      /**
       * ✅ Replace this block with your real API/auth call.
       * The ONLY requirement is:
       *  - localStorage.setItem("token", token)
       *  - localStorage.setItem("user", JSON.stringify({ name, email, role }))
       */

      // ---- TEMP demo storage (so everything works immediately) ----
      const token = "demo-token";
      const role: Role = "customer"; // change when your real backend returns role

      const userToStore: StoredUser = {
        name: getDisplayName(email),
        email,
        role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userToStore));
      // ------------------------------------------------------------

      // ✅ this makes Navbar update immediately (no refresh)
      window.dispatchEvent(new Event("auth:changed"));

      const user = readUser();
      const finalRole = (user?.role ?? "unknown") as Role;

      if (finalRole === "entrepreneur") navigate("/dashboard/entrepreneur");
      else if (finalRole === "admin") navigate("/admin");
      else navigate("/marketplace");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Login with your email and password.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-xs text-muted-foreground hover:underline"
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <Link to="/get-started" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
