// src/pages/Settings.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteDbUser, readAuth } from "@/lib/authStorage";

export default function Settings() {
  const nav = useNavigate();
  const { user } = readAuth();

  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const doDelete = async () => {
    setError("");
    setLoading(true);
    try {
      deleteDbUser(user.id, password);
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

      <div className="mt-6 rounded-xl border p-4">
        <div className="text-sm text-gray-600">Signed in as</div>
        <div className="font-medium">{user.email}</div>
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="text-sm text-red-700/80 mt-1">
          Deleting your account removes it from this device storage (demo). This
          cannot be undone.
        </p>

        <Button variant="destructive" className="mt-4" onClick={() => setShow(true)}>
          Delete account
        </Button>

        {show && (
          <div className="mt-4 rounded-xl border bg-white p-4">
            <div className="text-sm font-medium">Confirm password</div>
            <div className="mt-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={loading} onClick={doDelete}>
                {loading ? "Deleting..." : "Confirm delete"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
