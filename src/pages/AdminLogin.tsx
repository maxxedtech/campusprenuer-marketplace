import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginDbUser, setSession } from "@/lib/authStorage";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Block direct access on page load
  useEffect(() => {
    const intent = sessionStorage.getItem("cp_admin_intent");
    if (!intent) {
      window.location.href = "/login";
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = loginDbUser(email, password);
      if (user.role !== "admin") throw new Error("Not an admin account");

      setSession(user);
      sessionStorage.removeItem("cp_admin_intent");
      nav("/admin");
    } catch (err: any) {
      setError(err?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <p className="text-sm text-gray-600 mt-1">Restricted access.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Admin Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@campusprenuer.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Admin Password</label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Admin password"
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
