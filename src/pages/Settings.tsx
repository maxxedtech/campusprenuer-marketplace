import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase";

export default function Settings() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const doDelete = async () => {
    setLoading(true);

    // ⚠️ Supabase delete user (requires backend normally)
    await supabase.from("users").delete().eq("id", user.id);

    await logout();
    nav("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="mt-6 rounded-xl border p-4">
        <div className="text-sm text-gray-600">Signed in as</div>
        <div className="font-medium">{user.email}</div>
      </div>

      <div className="mt-6 border border-red-200 bg-red-50 p-4 rounded-xl">
        <h2 className="text-red-700 font-semibold">Danger zone</h2>

        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => setShow(true)}
        >
          Delete account
        </Button>

        {show && (
          <div className="mt-4">
            <Button onClick={doDelete} disabled={loading}>
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
