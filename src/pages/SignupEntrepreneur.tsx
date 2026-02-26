import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type StoredUser = {
  name: string;
  role: "customer" | "entrepreneur" | "admin";
  email?: string;
  businessName?: string;
};

const SignupEntrepreneur = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // optional if you have backend
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /**
       * ✅ OPTION A (Recommended): Call your backend signup endpoint here.
       * Replace this block with your API call.
       *
       * Example:
       * const res = await api.post("/auth/signup", { name, email, password, role: "entrepreneur", businessName });
       * const token = res.data.token;
       * const userFromApi = res.data.user;
       */

      // ✅ Works immediately: store locally (for UI testing)
      const user: StoredUser = {
        name: name.trim(),
        role: "entrepreneur",
        email: email.trim(),
        businessName: businessName.trim() || undefined,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "local-demo-token");

      // also store preferredRole so login page can show it (optional)
      localStorage.setItem("preferredRole", "entrepreneur");

      navigate("/entrepreneur-dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Create an Entrepreneur account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List products and sell on campus.
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Dave Adamson"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Business name (optional)</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Dave Snacks"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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
            {loading ? "Creating account..." : "Sign up as Entrepreneur"}
          </Button>

          <div className="text-sm text-muted-foreground">
            Just want to buy?{" "}
            <Link to="/signup-customer" className="text-primary hover:underline">
              Sign up as Customer
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupEntrepreneur;
