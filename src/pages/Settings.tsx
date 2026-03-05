// src/pages/Settings.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { deleteAccount } from "@/lib/storage";

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const onDelete = async () => {
    setError("");
    setLoading(true);
    try {
      deleteAccount(user.id, password);
      logout();
      nav("/");
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-gray-600 mt-1">Manage your account.</p>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-gray-600 mt-1">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="text-sm text-red-700/80 mt-1">
          Deleting your account removes your profile from this device storage (demo). This action can’t be undone.
        </p>

        <Button variant="destructive" className="mt-4" onClick={() => setOpen(true)}>
          Delete account
        </Button>

        {open && (
          <div className="mt-4 rounded-xl border bg-white p-4">
            <p className="text-sm font-medium">Confirm your password to delete:</p>

            <div className="mt-3 space-y-2">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDelete} disabled={loading}>
                {loading ? "Deleting..." : "Confirm delete"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
