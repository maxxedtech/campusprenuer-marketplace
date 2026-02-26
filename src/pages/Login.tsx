import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Role = "entrepreneur" | "customer" | "admin";

type StoredUser = {
  name: string;
  role: Role;
  email?: string;
};

function redirectByRole(navigate: ReturnType<typeof useNavigate>, role: Role) {
  if (role === "admin") return navigate("/admin");
  if (role === "entrepreneur") return navigate("/entrepreneur-dashboard");
  return navigate("/marketplace");
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const Login = () => {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: if someone came from signup pages, we can remember intended role.
  const preferredRole = useMemo(() => {
    const r = localStorage.getItem("preferredRole");
    if (r === "entrepreneur" || r === "customer" || r === "admin") return r;
    return null;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /**
       * ✅ OPTION A (Recommended): Use your real backend login here.
       * Replace this whole block with your API call and set `userFromApi` + `tokenFromApi`.
       *
       * Example:
       * const res = await api.post("/auth/login", { emailOrUsername, password });
       * const userFromApi = { name: res.data.user.name, role: res.data.user.role, email: res.data.user.email };
       * const tokenFromApi = res.data.token;
       */

      // ✅ OPTION B (Works immediately): Login based on what you stored during signup
      // This expects signup saved a "user" object already.
      const existingUser = safeJsonParse<StoredUser>(localStorage.getItem("user"));

      // If no existing user, we still create one so you can test UI.
      const userFromApi: StoredUser = existingUser ?? {
        name: emailOrUsername.trim() || "My Account",
        role: preferredRole ?? "customer",
        email: emailOrUsername.includes("@") ? emailOrUsername.trim() : undefined,
      };

      const tokenFromApi = "local-demo-token";

      // Save auth
      localStorage.setItem("token", tokenFromApi);
      localStorage.setItem("user", JSON.stringify(userFromApi));

      // Clean helper key
      localStorage.removeItem("preferredRole");

      // Redirect by role
      redirectByRole(navigate, userFromApi.role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Login to continue to CampusPreneur.
        </p>

        {preferredRole && (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            You’re signing in as{" "}
            <span className="font-medium text-foreground">
              {preferredRole === "entrepreneur"
                ? "Entrepreneur"
                : preferredRole === "customer"
                  ? "Customer"
                  : "Admin"}
            </span>
            .
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Email / Username
            </label>
            <input
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <Link to="/" className="text-muted-foreground hover:underline">
              Back home
            </Link>
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/signup-customer" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
