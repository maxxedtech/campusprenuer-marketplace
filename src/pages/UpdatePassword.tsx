import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { cleanAuthCallbackUrl } from "@/lib/authVerification";

type RecoveryState = "checking" | "ready" | "invalid";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [recoveryState, setRecoveryState] = useState<RecoveryState>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    let sessionDetected = false;

    if (!isSupabaseConfigured) {
      setError("Authentication is not configured for this deployment yet.");
      setRecoveryState("invalid");
      return () => {
        mounted = false;
      };
    }

    const acceptRecoverySession = () => {
      if (!mounted) return;
      sessionDetected = true;
      cleanAuthCallbackUrl();
      setRecoveryState("ready");
      setError("");
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        acceptRecoverySession();
      }
    });

    const exchangeRecoveryCode = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!mounted) return;
        if (exchangeError || !data.session) {
          setError("This password recovery link is invalid or has expired.");
          setRecoveryState("invalid");
          return;
        }
        acceptRecoverySession();
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;
      if (sessionError || !data.session) {
        window.setTimeout(() => {
          if (!mounted || sessionDetected) return;
          setError("This password recovery link is invalid or has expired.");
          setRecoveryState("invalid");
        }, 700);
        return;
      }

      acceptRecoverySession();
    };

    void exchangeRecoveryCode();

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully! Redirecting to sign in...");
    window.setTimeout(() => navigate("/login", { replace: true }), 1500);
  };

  if (recoveryState === "checking") {
    return <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><div className="surface-card w-full max-w-md p-6 text-center sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="mt-2 page-title text-2xl">Checking your recovery link</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Please wait while we securely prepare your password reset.</p></div></div>;
  }

  if (recoveryState === "invalid") {
    return <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><div className="surface-card w-full max-w-md p-6 text-center sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="mt-2 page-title text-2xl">Recovery link unavailable</h1><p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{error || "This password recovery link is invalid or has expired."}</p><Button asChild className="mt-6 w-full"><Link to="/forgot-password">Reset your password</Link></Button><Link className="mt-5 block text-sm font-semibold text-brand-navy hover:underline" to="/login">Back to sign in</Link></div></div>;
  }

  return <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><form onSubmit={submit} className="surface-card w-full max-w-md space-y-4 p-6 sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="page-title text-2xl">Set a New Password</h1><p className="text-sm leading-6 text-muted-foreground">Choose a new password for your CampusPreneur account.</p><div><label htmlFor="update-new-password" className="field-label">New Password</label><Input id="update-new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div><div><label htmlFor="update-confirm-password" className="field-label">Confirm Password</label><Input id="update-confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></div>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}<Button type="submit" className="w-full" disabled={loading || Boolean(message)}>{loading ? "Updating..." : "Update password"}</Button></form></div>;
}
