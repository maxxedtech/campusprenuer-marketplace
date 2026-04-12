import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      if (!current) return;

      setUser(current);
      setName(current.name || "");
      setAvatar(current.avatar_url || "");
    };

    load();
  }, []);

  // 🖼️ UPLOAD IMAGE
  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    const fileName = `${user.id}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    setAvatar(data.publicUrl);
    setUploading(false);
  };

  // 💾 SAVE PROFILE
  const handleSave = async () => {
    if (!user) return;

    await supabase
      .from("users")
      .update({
        name,
        avatar_url: avatar,
      })
      .eq("id", user.id);

    alert("Profile updated ✅");
  };

  return (
    <div className="max-w-md mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">
        Edit Profile
      </h1>

      {/* AVATAR */}
      <div className="flex flex-col items-center gap-3 mb-4">

        {avatar ? (
          <img
            src={avatar}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            ?
          </div>
        )}

        <input type="file" onChange={handleUpload} />

        {uploading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {/* NAME */}
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mb-4"
      />

      {/* SAVE */}
      <Button onClick={handleSave} className="w-full">
        Save Changes
      </Button>

    </div>
  );
}
