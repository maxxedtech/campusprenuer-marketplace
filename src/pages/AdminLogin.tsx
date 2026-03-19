import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 simple demo auth (you can replace with backend later)
    if (email === "admin@campus.com" && password === "admin123") {
      localStorage.setItem("token", "admin-token");

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Super Admin",
          role: "admin",
          email,
        })
      );

      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
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
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
