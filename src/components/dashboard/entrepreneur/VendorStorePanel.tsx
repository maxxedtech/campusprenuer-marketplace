import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Loader2, Store, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { VendorStoreStatus } from "@/types/vendor";
import { toast } from "sonner";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const suffix = () => Math.random().toString(36).slice(2, 7);

function statusCopy(status: VendorStoreStatus) {
  if (status === "approved") return { label: "Approved", className: "bg-green-100 text-green-700", icon: CheckCircle2 };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-100 text-red-700", icon: XCircle };
  if (status === "suspended") return { label: "Suspended", className: "bg-slate-200 text-slate-700", icon: XCircle };
  return { label: "Pending review", className: "bg-amber-100 text-amber-800", icon: Clock3 };
}

export default function VendorStorePanel() {
  const { user, profile, isVendor, vendorStore, refreshAccount } = useAuth();
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [campus, setCampus] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendorStore) {
      setStoreName(vendorStore.store_name);
      setSlug(vendorStore.slug);
      setCampus(vendorStore.campus);
      setDescription(vendorStore.description || "");
      return;
    }
    setCampus(profile?.campus || "");
  }, [vendorStore, profile?.campus]);

  if (!isVendor || !user) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!storeName.trim() || !campus.trim()) {
      toast.error("Add a store name and campus before continuing.");
      return;
    }

    setSaving(true);
    try {
      if (vendorStore) {
        const { error } = await supabase.from("vendor_stores").update({
          store_name: storeName.trim(),
          campus: campus.trim(),
          description: description.trim(),
          status: vendorStore.status === "rejected" ? "pending" : vendorStore.status,
          updated_at: new Date().toISOString(),
        }).eq("id", vendorStore.id).eq("owner_id", user.id);
        if (error) throw error;
        toast.success("Store details updated.");
      } else {
        const base = slugify(storeName) || "campus-store";
        const generatedSlug = `${base}-${suffix()}`;
        const { error } = await supabase.from("vendor_stores").insert({
          owner_id: user.id,
          store_name: storeName.trim(),
          slug: generatedSlug,
          campus: campus.trim(),
          description: description.trim(),
          status: "pending",
        });
        if (error) throw error;
        setSlug(generatedSlug);
        toast.success("Store submitted for admin review.");
      }
      await refreshAccount();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "We could not save your store.");
    } finally {
      setSaving(false);
    }
  };

  const status = vendorStore ? statusCopy(vendorStore.status) : null;
  const StatusIcon = status?.icon;

  return (
    <section className="surface-card space-y-6 p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-orange"><Store className="h-5 w-5" /></div>
          <div><p className="eyebrow">Seller setup</p><h2 className="mt-1 font-display text-xl font-semibold text-brand-navy">{vendorStore ? "Your campus store" : "Create your campus store"}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{vendorStore ? "Keep the public details for your store up to date." : "Your store will be reviewed before it is listed publicly."}</p></div>
        </div>
        {status && StatusIcon && <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold ${status.className}`}><StatusIcon className="h-3.5 w-3.5" />{status.label}</span>}
      </div>

      {vendorStore?.status === "rejected" && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Your store needs changes before it can be approved. Update the details and submit again.</p>}
      {vendorStore?.status === "suspended" && <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">This store is currently suspended. Contact an administrator if you need help.</p>}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div><label className="field-label" htmlFor="vendor-store-name">Store name</label><Input id="vendor-store-name" value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="e.g. Rose & Co." required /></div>
        <div><label className="field-label" htmlFor="vendor-store-slug">Store URL slug</label><Input id="vendor-store-slug" value={slug || "Generated when you create the store"} readOnly className="text-muted-foreground" /><p className="field-help">The slug is generated once to keep your store link stable.</p></div>
        <div><label className="field-label" htmlFor="vendor-store-campus">Campus or area</label><Input id="vendor-store-campus" value={campus} onChange={(event) => setCampus(event.target.value)} placeholder="e.g. UNILAG, Akoka" required /></div>
        <div className="sm:col-span-2"><label className="field-label" htmlFor="vendor-store-description">Store description <span className="font-normal text-muted-foreground">(optional)</span></label><textarea id="vendor-store-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Tell campus shoppers what you sell and what makes your store useful." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
        <div className="sm:col-span-2"><Button type="submit" variant="hero" disabled={saving}>{saving && <Loader2 className="animate-spin" />}{vendorStore ? "Save store details" : "Create store for review"}</Button></div>
      </form>
    </section>
  );
}
