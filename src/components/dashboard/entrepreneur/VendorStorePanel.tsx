import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, Loader2, Store, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaiduguriAreaField } from "@/components/common/MaiduguriAreaField";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { VendorStoreStatus } from "@/types/vendor";
import { toast } from "sonner";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const suffix = () => Math.random().toString(36).slice(2, 7);
const states = ["Borno","Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
const categories = ["Fashion & Thrift Store","Tech & Gadgets","Food & Bakery","Beauty & Grooming","Books & Stationery","Home & Lifestyle","Professional Services","Other"];

function statusCopy(status: VendorStoreStatus) {
  if (status === "approved") return { label: "Approved", className: "bg-green-100 text-green-700", icon: CheckCircle2 };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-100 text-red-700", icon: XCircle };
  if (status === "suspended") return { label: "Suspended", className: "bg-slate-200 text-slate-700", icon: XCircle };
  return { label: "Pending review", className: "bg-amber-100 text-amber-800", icon: Clock3 };
}

export default function VendorStorePanel() {
  const { user, profile, isVendor, vendorStore, refreshAccount } = useAuth();
  const [storeName, setStoreName] = useState(""); const [slug, setSlug] = useState(""); const [city, setCity] = useState(""); const [state, setState] = useState("Borno"); const [description, setDescription] = useState(""); const [businessCategory, setBusinessCategory] = useState(""); const [phone, setPhone] = useState(""); const [pickupNote, setPickupNote] = useState("");
  const [guarantorName, setGuarantorName] = useState(""); const [guarantorPhone, setGuarantorPhone] = useState(""); const [guarantorRelationship, setGuarantorRelationship] = useState(""); const [guarantorOccupationAddress, setGuarantorOccupationAddress] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendorStore) { setStoreName(vendorStore.store_name); setSlug(vendorStore.slug); setCity(vendorStore.city); setState(vendorStore.state || "Borno"); setDescription(vendorStore.description || ""); setBusinessCategory(vendorStore.business_category || ""); setPhone(vendorStore.phone || profile?.phone || ""); setPickupNote(vendorStore.pickup_note || ""); }
    else { setCity(profile?.city || ""); setState(profile?.state || "Borno"); setPhone(profile?.phone || ""); }
    setGuarantorName(profile?.guarantor_name || ""); setGuarantorPhone(profile?.guarantor_phone || ""); setGuarantorRelationship(profile?.guarantor_relationship || ""); setGuarantorOccupationAddress(profile?.guarantor_occupation_address || "");
  }, [vendorStore, profile]);
  if (!isVendor || !user) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!storeName.trim() || !city.trim() || !state || !guarantorName.trim() || !guarantorPhone.trim() || !guarantorRelationship.trim()) { toast.error("Complete your store location and all required guarantor details."); return; }
    if (!/^\+?[0-9\s()-]{10,16}$/.test(guarantorPhone.trim())) { toast.error("Enter a valid guarantor phone number."); return; }
    setSaving(true);
    try {
      const storeSlug = slugify(slug || storeName) || `store-${suffix()}`;
      const payload = { store_name: storeName.trim(), slug: storeSlug, city: city.trim(), state, description: description.trim() || null, business_category: businessCategory || null, phone: phone.trim() || null, pickup_note: pickupNote.trim() || null, status: vendorStore?.status === "rejected" ? "pending" : vendorStore?.status || "pending", updated_at: new Date().toISOString() };
      const result = vendorStore
        ? await supabase.from("vendor_stores").update(payload).eq("id", vendorStore.id).eq("owner_id", user.id)
        : await supabase.from("vendor_stores").insert({ ...payload, owner_id: user.id });
      if (result.error) throw result.error;
      const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, guarantor_name: guarantorName.trim(), guarantor_phone: guarantorPhone.trim(), guarantor_relationship: guarantorRelationship.trim(), guarantor_occupation_address: guarantorOccupationAddress.trim() || null, updated_at: new Date().toISOString() });
      if (profileError) throw profileError;
      setSlug(storeSlug); await refreshAccount(); toast.success("Store and guarantor details saved.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "We could not save your store."); }
    finally { setSaving(false); }
  };
  const storeStatus = vendorStore ? statusCopy(vendorStore.status) : statusCopy("pending"); const StatusIcon = storeStatus.icon;
  const verified = profile?.is_verified === true;
  const previewUrl = `https://campusprenuer.vercel.app/store/${slugify(slug || storeName)}`;

  return <section className="surface-card space-y-6 p-6 sm:p-8"><header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-orange"><Store className="h-5 w-5" /></div><div><p className="eyebrow">Seller Studio</p><h1 className="mt-1 font-display text-xl font-semibold text-brand-navy">Store Setup &amp; Verification</h1><p className="mt-1 text-sm leading-6 text-muted-foreground">Manage your public shop details and accountability information.</p></div></div><div className="flex flex-wrap gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${storeStatus.className}`}><StatusIcon className="h-3.5 w-3.5" />Store {storeStatus.label}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{verified ? "Verified seller" : "Pending Review"}</span></div></header>
    <div className="rounded-xl border border-brand-orange/30 bg-orange-50 px-4 py-3 text-sm text-brand-navy">Currently live in Maiduguri, Borno State (expanding to more cities soon).</div>
    {vendorStore?.status === "rejected" && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Your store needs changes before approval. Update the details and resubmit.</p>}
    <form onSubmit={handleSubmit} className="space-y-7"><fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 font-display text-lg font-semibold text-brand-navy">Store details</legend><div><label className="field-label" htmlFor="store-name">Store name</label><Input id="store-name" value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="e.g. Maxxed Tech" required /></div><div><label className="field-label" htmlFor="store-slug">Store URL slug</label><Input id="store-slug" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="your-store-name" required /><p className="field-help">A URL-safe shop name that buyers can remember.</p></div><div className="sm:col-span-2 rounded-xl border border-border bg-muted/30 p-4 text-sm"><p className="font-semibold text-brand-navy">Your unique shop link</p><p className="mt-1 leading-6 text-muted-foreground">Your Store URL Slug is your unique shop link on Campuspreneur. Share this link on WhatsApp, Instagram, or flyers so buyers can open your storefront directly.</p>{slugify(slug || storeName) && <a className="mt-2 inline-flex items-center gap-1 break-all font-semibold text-brand-orange underline" href={previewUrl} target="_blank" rel="noreferrer">{previewUrl}<ExternalLink className="h-4 w-4 shrink-0" /></a>}</div><div><label className="field-label" htmlFor="store-category">Business category</label><select id="store-category" value={businessCategory} onChange={(event) => setBusinessCategory(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select a category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="field-label" htmlFor="store-phone">WhatsApp / Business phone</label><Input id="store-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 800 000 0000" /></div><MaiduguriAreaField id="store-city" value={city} onChange={setCity} /><div><label className="field-label" htmlFor="store-state">State</label><select id="store-state" value={state} onChange={(event) => setState(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" required>{states.map((item) => <option key={item} value={item}>{item === "Borno" ? "Borno · Active Launch Region" : `${item} · Coming Soon`}</option>)}</select></div><div className="sm:col-span-2"><label className="field-label" htmlFor="store-bio">Store bio / description</label><textarea id="store-bio" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Describe your products and services." /></div><div className="sm:col-span-2"><label className="field-label" htmlFor="pickup-note">Pickup / delivery note</label><textarea id="pickup-note" value={pickupNote} onChange={(event) => setPickupNote(event.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Tell customers how to arrange collection or delivery." /></div></fieldset>
      <fieldset className="grid gap-4 rounded-2xl border border-border p-4 sm:grid-cols-2"><legend className="px-2 font-display text-lg font-semibold text-brand-navy">Guarantor &amp; accountability</legend><div><label className="field-label" htmlFor="guarantor-full-name">Guarantor full name</label><Input id="guarantor-full-name" value={guarantorName} onChange={(event) => setGuarantorName(event.target.value)} required /></div><div><label className="field-label" htmlFor="guarantor-phone">Guarantor phone number</label><Input id="guarantor-phone" type="tel" value={guarantorPhone} onChange={(event) => setGuarantorPhone(event.target.value)} pattern="\+?[0-9\s()-]{10,16}" required /></div><div><label className="field-label" htmlFor="guarantor-relationship">Relationship</label><select id="guarantor-relationship" value={guarantorRelationship} onChange={(event) => setGuarantorRelationship(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" required><option value="">Select relationship</option>{["Parent","Relative","Employer","Mentor","Business Associate","Other"].map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="field-label" htmlFor="guarantor-address">Guarantor occupation / address</label><Input id="guarantor-address" value={guarantorOccupationAddress} onChange={(event) => setGuarantorOccupationAddress(event.target.value)} placeholder="Occupation and area" /></div></fieldset>
      <Button type="submit" variant="hero" disabled={saving}>{saving && <Loader2 className="animate-spin" />}{saving ? "Saving…" : "Save store setup"}</Button></form>
  </section>;
}
