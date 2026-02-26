import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { MapPin, ShoppingBag, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingButton } from "@/components/ui/LoadingButton";

const SignupCustomer = () => {
  const { signup } = useAuth();

  const [name, setName] = useState("");
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
      await signup(name, email, password, "customer");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-hero">
      <div className="card-soft w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">CampusPrenue</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/30 text-xs font-medium mb-4">
          <ShoppingBag className="w-3 h-3" />
          Customer Account
        </div>

        <h1 className="text-xl font-display font-bold">Join CampusPrenue</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Discover local products & services
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>

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

          {error && <p className="text-xs text-destructive">{error}</p>}

          <LoadingButton type="submit" loading={loading} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create Account
          </LoadingButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login/customer"
            className="text-foreground font-medium hover:underline"
          >
            Log in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-2">
          Want to sell?{" "}
          <Link
            to="/signup/entrepreneur"
            className="text-foreground font-medium hover:underline"
          >
            Sign up as entrepreneur
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupCustomer;
