import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findUser } from "@/utils/userStorage";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = findUser(email.trim(), password);

      if (!user) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // session
      localStorage.setItem("token", "local-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      // redirect based on role
      if (user.role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/marketplace");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Login with the email you used to sign up.
          </p>
        </div>

        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3">
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/get-started" className="underline">
            Get started
          </Link>
        </div>

        <div className="text-sm">
          <Link to="/forgot-password" className="underline text-muted-foreground">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
