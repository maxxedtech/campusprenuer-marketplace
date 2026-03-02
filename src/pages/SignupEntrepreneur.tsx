import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AUTH_CHANGED_EVENT = "auth-changed";
const USERS_KEY = "users_db";

type Role = "entrepreneur" | "customer" | "admin";
type StoredUser = {
  name: string;
  email: string;
  role: Role;
  password: string; // MVP only (do not do this in production)
};

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

export default function SignupEntrepreneur() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanName = fullName.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanName) throw new Error("Enter your full name");
      if (!cleanEmail) throw new Error("Enter your email");
      if (!password) throw new Error("Enter a password");

      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) throw new Error("An account with this email already exists");

      const newUser: StoredUser = {
        name: cleanName,
        email: cleanEmail,
        role: "entrepreneur",
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

      navigate("/dashboard/entrepreneur");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Entrepreneur Sign Up</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create your entrepreneur account
        </p>

        <div className="mt-5 grid gap-3">
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          {error && (
            <div className="text-sm border border-destructive/30 bg-destructive/10 rounded-xl p-3">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-sm text-muted-foreground">
            Want to buy instead?{" "}
            <Link className="underline hover:text-foreground" to="/signup/customer">
              Sign up as Customer
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline hover:text-foreground" to="/login">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
