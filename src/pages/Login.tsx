import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      toast.success("Welcome back 👋");

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else navigate("/marketplace");

    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
          <p className="text-sm text-gray-500">
            Login to continue your journey
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
          />

          <Button
            onClick={handleLogin}
            className="w-full h-11 text-base"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>

        {/* LINKS */}
        <div className="flex justify-between text-sm text-gray-500">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>

          <Link to="/get-started" className="hover:underline">
            Sign up
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* GOOGLE BUTTON (UI ONLY FOR NOW) */}
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => toast("Google login coming soon 🚀")}
        >
          Continue with Google
        </Button>

      </div>
    </div>
  );
}
