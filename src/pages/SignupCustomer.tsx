import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupCustomer() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [campus, setCampus] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: { full_name: name.trim(), phone: phone.trim() || null, campus: campus.trim() || null, role: "customer" },
        },
      });
      if (signupError) throw signupError;

      setSuccess(true);
      if (data.session) navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="font-bold text-lg">Welcome 🎉</h2>
            <p className="text-sm">Check your email to verify your account before signing in.</p>
          </div>
        </div>
      )}

      <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><div className="surface-card w-full max-w-md p-6 sm:p-8">
        <p className="eyebrow">Customer account</p><h1 className="mt-2 page-title text-2xl">Create your account</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Shop from student businesses and connect with sellers on campus.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <label className="field-label" htmlFor="customer-name">Full name</label><Input id="customer-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="field-label" htmlFor="customer-email">Email address</label><Input id="customer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="field-label" htmlFor="customer-phone">Phone number <span className="font-normal text-muted-foreground">(optional)</span></label><Input id="customer-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label className="field-label" htmlFor="customer-campus">Campus or area <span className="font-normal text-muted-foreground">(optional)</span></label><Input id="customer-campus" value={campus} onChange={(e) => setCampus(e.target.value)} />

          <label className="field-label" htmlFor="customer-password">Password</label><div className="relative"><Input id="customer-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">{showPassword ? <EyeOff /> : <Eye />}</button></div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div></div>
    </>
  );
}
