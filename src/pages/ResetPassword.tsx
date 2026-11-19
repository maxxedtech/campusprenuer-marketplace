import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else {
      setMessage("Password updated. Redirecting to sign in...");
      window.setTimeout(() => navigate("/login"), 900);
    }
    setLoading(false);
  };

  return <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12"><form onSubmit={submit} className="surface-card w-full max-w-md space-y-4 p-6 sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="page-title text-2xl">Choose a new password</h1><p className="text-sm leading-6 text-muted-foreground">Use a password you haven’t used before.</p><div><label htmlFor="new-password" className="field-label">New password</label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div><div><label htmlFor="confirm-password" className="field-label">Confirm password</label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></div>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}<Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update password"}</Button></form></div>;
}
