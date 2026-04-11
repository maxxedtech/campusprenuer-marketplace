// src/pages/AdminLogin.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { loginUser } from "@/lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      // 🔐 check if user is admin
      if (user.role !== "admin") {
        setError("Access denied. Not an admin.");
        return;
      }

      // ✅ success
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/40">
      <div className="w-full max-w-md bg-background border rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-4">
          <Shield className="text-primary" />
          <h1 className="text-xl font-bold">Admin Access</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Restricted area. Authorized personnel only.
        </p>

        {error && (
          <div className="text-sm text-red-500 mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
