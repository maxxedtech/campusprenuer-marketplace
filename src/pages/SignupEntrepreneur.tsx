import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSession, signupDbUser } from "@/lib/authStorage";

export default function SignupEntrepreneur() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
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
        phone,
        address,
        businessName,
        password,
        role: "entrepreneur",
      });

      setSession(user);
      setWelcomeName(user.name);

      setTimeout(() => {
        navigate("/dashboard/entrepreneur", { replace: true });
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
              Your entrepreneur account has been created successfully.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-1 text-xl font-bold">Entrepreneur Sign Up</h1>
        <p className="mb-4 text-sm opacity-80">
          Create an account to sell on campus.
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
            <label className="text-sm font-medium">Business name</label>
            <Input
              placeholder="Business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
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
            <label className="text-sm font-medium">Phone number</label>
            <Input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Address / Hostel / Location</label>
            <Input
              placeholder="Address / Hostel / Location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            {loading ? "Creating..." : "Create entrepreneur account"}
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
