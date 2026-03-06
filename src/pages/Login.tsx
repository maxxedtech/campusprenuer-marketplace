import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginDbUser, setSession } from "@/lib/authStorage";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = loginDbUser(email, password);

      if (user.role === "admin") {
        setError("Admin cannot login from the normal login page.");
        setLoading(false);
        return;
      }

      setSession(user);

      if (user.role === "entrepreneur") nav("/dashboard/entrepreneur");
      else nav("/marketplace");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-gray-600">
        Enter your email and password to continue.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            type="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/get-started" className="text-blue-600 hover:underline">
            Get Started
          </Link>
        </div>
      </form>
    </div>
  );
}
