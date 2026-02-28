import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AUTH_CHANGED_EVENT = "auth-changed";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

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
      /**
       * ✅ If you have a backend:
       * Replace this fake response with your API call,
       * but keep the "success block" exactly the same.
       */

      // --- FAKE SIGNUP (works immediately) ---
      // In a real app, you would do:
      // const res = await fetch("/api/signup/entrepreneur", { ... })
      // const data = await res.json()
      const token = "demo-token-" + Date.now();
      const user = {
        fullName,
        email,
        role: "entrepreneur" as Role,
      };
      // --- END FAKE SIGNUP ---

      // ✅ SUCCESS BLOCK (this is the important part)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
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
            <div className="text-sm text-red-500 border border-red-200 bg-red-50 rounded-xl p-3">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

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
