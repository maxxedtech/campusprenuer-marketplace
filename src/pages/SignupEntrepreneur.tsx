// src/pages/SignupEntrepreneur.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpUser } from "@/lib/auth";

export default function SignupEntrepreneur() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUpUser({
        name,
        email,
        password,
        role: "entrepreneur",
        business_name: businessName,
        phone,
        address,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard/entrepreneur");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="font-bold text-lg">Welcome 🚀</h2>
            <p className="text-sm">Entrepreneur account created</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md p-6">
        <h1 className="text-xl font-bold mb-2">Entrepreneur Sign Up</h1>

        {error && (
          <div className="text-red-500 text-sm mb-3">{error}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input
            placeholder="Address / Location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Entrepreneur Account"}
          </Button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
