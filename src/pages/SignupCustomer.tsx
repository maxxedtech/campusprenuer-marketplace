import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Role = "entrepreneur" | "customer" | "admin";
type StoredUser = {
  name: string;
  email: string;
  role: Role;
  password: string; // MVP only (do not do this in production)
};

const USERS_KEY = "users_db";
const AUTH_CHANGED_EVENT = "auth-changed";

function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const SignupCustomer = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // MVP only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanName) throw new Error("Enter your name");
      if (!cleanEmail) throw new Error("Enter your email");
      if (!password) throw new Error("Enter a password");

      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) throw new Error("An account with this email already exists");

      const newUser: StoredUser = {
        name: cleanName,
        email: cleanEmail,
        role: "customer",
        password,
      };

      users.push(newUser);
      saveUsers(users);

      // Create session
      localStorage.setItem("token", "local-demo-token-" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({ name: newUser.name, email: newUser.email, role: newUser.role })
      );
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

      navigate("/marketplace");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">
          Create a Customer account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Buy and connect with student entrepreneurs.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Dave Adamson"
              required
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
            {loading ? "Creating account..." : "Sign up as Customer"}
          </Button>

          <div className="text-sm text-muted-foreground">
            Want to sell instead?{" "}
            <Link to="/signup/entrepreneur" className="text-primary hover:underline">
              Sign up as Entrepreneur
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

export default SignupCustomer;
