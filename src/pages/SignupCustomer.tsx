import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSession, signupDbUser } from "@/lib/authStorage";

export default function SignupCustomer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeName, setWelcomeName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = signupDbUser({
        name,
        email,
        password,
        role: "customer",
      });

      setSession(user);
      setWelcomeName(user.name);

      setTimeout(() => {
        navigate("/marketplace", { replace: true });
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {welcomeName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-lg font-semibold">Welcome back, {welcomeName}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your customer account has been created successfully.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-1 text-xl font-bold">Customer Sign Up</h1>
        <p className="mb-4 text-sm opacity-80">
          Create an account to browse and buy.
        </p>

        <form onSubmit={handleSignup} className="space-y-3">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Full name</label>
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create customer account"}
          </Button>
        </form>

        <p className="mt-4 text-sm opacity-80">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
