import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupEntrepreneur() {
  const navigate = useNavigate();
  const { loginLocal } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // local demo signup
    loginLocal({
      id: String(Date.now()),
      name,
      email,
      role: "entrepreneur",
    });

    navigate("/dashboard/entrepreneur", { replace: true });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Entrepreneur Sign Up</h1>

      <form onSubmit={handleSignup} className="space-y-3">
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Button className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create entrepreneur account"}
        </Button>
      </form>

      <p className="mt-4 text-sm opacity-80">
        Already have an account? <Link to="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
