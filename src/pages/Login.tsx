import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name}! 👋`);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        // Direct buyers and sellers straight to the personalized details/hub page
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50/40 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* LOGIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-border p-6 sm:p-8 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <img src="/logo-icon.png" alt="" className="w-7 h-7 object-contain rounded-full"
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to your buyer, seller, or administrator account.
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <Input
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-orange hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 rounded-xl"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 text-base font-bold bg-brand-orange hover:bg-brand-orange/90 text-white rounded-2xl shadow-md shadow-brand-orange/25 transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login to Campuspreneur"}
            </Button>
          </div>

          {/* SIGN UP LINKS */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
            Don't have an account yet?{" "}
            <Link to="/get-started" className="font-bold text-brand-navy hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
