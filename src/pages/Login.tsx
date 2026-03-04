import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, Role } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginLocal } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    loginLocal({
      id: String(Date.now()),
      name: name || "User",
      email,
      role,
    });

    if (role === "entrepreneur") navigate("/dashboard/entrepreneur", { replace: true });
    else if (role === "admin") navigate("/admin", { replace: true });
    else navigate("/marketplace", { replace: true });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <Input placeholder="Name (for demo)" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <div className="space-y-2">
          <label className="text-sm opacity-80">Role (demo)</label>
          <select className="w-full border rounded-md p-2" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="customer">Customer</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-sm opacity-80">
        New here? <Link to="/get-started" className="underline">Get Started</Link>
      </p>
    </div>
  );
}
