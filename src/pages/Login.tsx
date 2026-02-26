import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingButton } from "@/components/ui/LoadingButton";

const Login = ({ role }: { role: "customer" | "entrepreneur" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(email, password);

      if (loggedUser?.role === "entrepreneur") {
        navigate("/dashboard/entrepreneur");
      } else {
        navigate("/marketplace");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-display font-bold">
          Login as {role === "customer" ? "Customer" : "Entrepreneur"}
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Access your CampusPrenue account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>

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

          <LoadingButton type="submit" loading={loading}>
            Login
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default Login;
