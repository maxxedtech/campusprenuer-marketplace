import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "@/utils/userStorage";

export default function SignupEntrepreneur() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const record = createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "entrepreneur",
      });

      // auto-login after signup
      localStorage.setItem("token", "local-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: record.id,
          name: record.name,
          email: record.email,
          role: record.role,
        })
      );

      navigate("/dashboard/entrepreneur");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Sign up (Entrepreneur)</h1>
          <p className="text-sm text-muted-foreground">
            Create an account to list and manage products.
          </p>
        </div>

        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="space-y-3">
          <Input
            placeholder="Business / Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create entrepreneur account"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
