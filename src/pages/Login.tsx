import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

function readRole(): Role {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) return "unknown";
  try {
    const user = JSON.parse(userRaw) as { role?: Role };
    return (user?.role ?? "unknown") as Role;
  } catch {
    return "unknown";
  }
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
      // ✅ IMPORTANT: Use your existing login logic here.
      // If you already had a useAuth() context before, paste your old login(email, password) call here.
      //
      // For now, this expects your existing login code to store:
      // localStorage.setItem("token", token)
      // localStorage.setItem("user", JSON.stringify({ role: "...", ... }))
      //
      // If your project already logs in via API, keep it — just ensure the two keys are set.

      // ---- START: placeholder (replace with your real login call) ----
      // Example only: throw if empty (so you remember to wire real auth)
      if (!email || !password) throw new Error("Enter email and password");
      // ---- END: placeholder ----

      const role = readRole();

      if (role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else if (role === "admin") navigate("/admin");
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
