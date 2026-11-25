import { useEffect, useState } from "react";
import { Camera, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaiduguriAreaField } from "@/components/common/MaiduguriAreaField";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@backend/supabase/client";
import { toast } from "sonner";

const STATES = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];

export default function ProfilePage() {
  const { user, profile, refreshAccount } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Borno");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { setFullName(profile?.full_name || user?.name || ""); setPhone(profile?.phone || ""); setCity(profile?.city || ""); setState(profile?.state || "Borno"); setAvatarUrl(profile?.avatar_url || ""); }, [profile, user]);
  if (!user) return <div className="page-shell py-16 text-center text-muted-foreground">Loading profile…</div>;

  const uploadAvatar = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { toast.error("Choose an image no larger than 5 MB."); return; }
    const localPreview = URL.createObjectURL(file); setPreview(localPreview);
    setSaving(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { data, error } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
      const { error: updateError } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() });
      if (updateError) throw updateError;
      setAvatarUrl(urlData.publicUrl); await refreshAccount(); toast.success("Profile picture updated.");
    } catch (error) { setPreview(""); toast.error(error instanceof Error ? error.message : "Could not upload profile picture."); }
    finally { setSaving(false); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName.trim(), phone: phone.trim() || null, city: city.trim() || null, state: state || null, avatar_url: avatarUrl || null, updated_at: new Date().toISOString() });
      if (error) throw error;
      await refreshAccount(); toast.success("Profile saved.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save profile."); }
    finally { setSaving(false); }
  };

  const verified = profile?.is_verified === true || user.verification_status === "verified";
  return <main className="page-shell max-w-3xl py-10 sm:py-14"><div className="surface-card space-y-8 p-6 sm:p-9">
    <header className="flex flex-col items-center gap-5 border-b border-border pb-7 sm:flex-row"><div className="relative"><UserAvatar user={{ full_name: fullName, avatar_url: preview || avatarUrl }} size="lg" /><label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white shadow" aria-label="Choose profile picture"><Camera className="h-5 w-5" /><input className="sr-only" type="file" accept="image/*" onChange={(event) => void uploadAvatar(event.target.files?.[0])} /></label></div><div className="text-center sm:text-left"><p className="eyebrow">Your account</p><h1 className="page-title mt-1">{fullName || "Profile"}</h1><p className="mt-1 text-sm text-muted-foreground">{user.email}</p><div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start"><span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold capitalize text-white">{user.role}</span><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${verified ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{verified && <ShieldCheck className="h-3.5 w-3.5" />}{verified ? "Verified" : "Unverified"}</span>{(city || state) && <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"><MapPin className="h-3.5 w-3.5" />{[city, state].filter(Boolean).join(", ")}</span>}</div></div></header>
    <form onSubmit={(event) => void save(event)} className="space-y-5"><div className="flex items-center gap-2"><UserRound className="h-5 w-5 text-brand-orange" /><h2 className="font-display text-lg font-semibold">Personal details</h2></div><div className="rounded-xl border border-brand-orange/30 bg-orange-50 px-4 py-3 text-sm text-brand-navy">Currently live in Maiduguri, Borno State (expanding to more cities soon).</div><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="profile-name">Full name</label><Input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></div><div><label className="field-label" htmlFor="profile-email">Email</label><Input id="profile-email" value={user.email || ""} disabled /></div><div><label className="field-label" htmlFor="profile-phone">Phone</label><Input id="profile-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></div><MaiduguriAreaField id="profile-city" value={city} onChange={setCity} /><div><label className="field-label" htmlFor="profile-state">State · Borno launch region</label><select id="profile-state" value={state} onChange={(event) => setState(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="Borno">Borno</option>{STATES.filter((item) => item !== "Borno").map((item) => <option key={item} value={item}>{item} — Coming Soon</option>)}</select></div></div><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button></form>
  </div></main>;
}
