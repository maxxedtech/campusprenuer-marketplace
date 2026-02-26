import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { MapPin, Store, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingButton } from "@/components/ui/LoadingButton";

const SignupEntrepreneur = () => {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // NOTE: your current signup() doesn't take businessName,
      // so we keep it in UI without breaking your auth flow.
      await signup(name, email, password, "entrepreneur");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">CampusPrenue</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium mb-4">
          <Store className="w-3 h-3" />
          Entrepreneur Account
        </div>

        <h1 className="text-xl font-bold">Create your business</h1>

        <p className="text-sm text-gray-500 mt-1">
          Start selling to your local community
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium">Business Name</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium">Password</label>

            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-16"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <LoadingButton type="submit" loading={loading} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create Account
          </LoadingButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login/entrepreneur" className="font-medium underline">
            Log in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 mt-2">
          Looking to buy?{" "}
          <Link to="/signup/customer" className="font-medium underline">
            Sign up as customer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupEntrepreneur;
