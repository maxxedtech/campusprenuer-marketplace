import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (resetError) setError(resetError.message);
    else setMessage("If an account exists for that email, we sent a password reset link.");
    setLoading(false);
  };

  return <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><div className="surface-card w-full max-w-md p-6 sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="mt-2 page-title text-2xl">Reset your password</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your email and we’ll send a secure reset link.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><label htmlFor="forgot-email" className="field-label">Email address</label><Input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}<Button type="submit" variant="hero" className="w-full" disabled={loading}>{loading ? "Sending link..." : "Send reset link"}</Button></form><Link className="mt-6 block text-center text-sm font-semibold text-brand-navy hover:underline" to="/login">Back to sign in</Link></div></div>;
}
