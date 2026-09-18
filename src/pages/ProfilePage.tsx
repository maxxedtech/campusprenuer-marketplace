import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUser, type UserRecord } from "@/utils/userStorage";

export default function ProfilePage() {
  const [user, setUser] = useState<UserRecord | null>(null); const [name, setName] = useState(""); const [avatar, setAvatar] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { getCurrentUser().then((current) => { if (current) { setUser(current); setName(current.name); setAvatar(current.avatar_url || ""); } }); }, []);
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setAvatar(String(reader.result)); reader.readAsDataURL(file); };
  const handleSave = () => { if (!user) return; setSaving(true); const updated = updateUser(user.id, { name: name.trim() || user.name, avatar_url: avatar }); setUser(updated); setSaving(false); window.dispatchEvent(new Event("campus-auth-change")); };
  return <div className="max-w-md mx-auto p-6"><h1 className="text-2xl font-bold mb-4">Edit Profile</h1><div className="flex flex-col items-center gap-3 mb-4">{avatar ? <img src={avatar} className="w-24 h-24 rounded-full object-cover" /> : <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">?</div>}<input type="file" accept="image/*" onChange={handleUpload} /></div><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mb-4" /><Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Changes"}</Button></div>;
}
