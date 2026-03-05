// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
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
      const u = await login(email, password);

      if (u.role === "admin") nav("/admin");
      else if (u.role === "entrepreneur") nav("/dashboard/entrepreneur");
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
      <p className="text-sm text-gray-600 mt-1">Welcome back. Enter your details to continue.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            type="password"
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">New here?</span>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          Tip: Admin login is hidden. Click the Navbar “Login” button 3 times quickly.
        </p>
      </form>
    </div>
  );
}
