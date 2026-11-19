import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, FileText, RefreshCw, Search, ShieldCheck, Store, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { VerificationIdType, VendorStoreStatus, VendorVerificationRecord } from "@/types/vendor";

type Tab = "stores" | "verifications";

type StoreRow = {
  id: string;
  owner_id: string;
  store_name: string;
  slug: string;
  campus: string;
  description: string | null;
  status: VendorStoreStatus;
  ownerName: string;
  ownerEmail: string;
};

type VerificationRow = VendorVerificationRecord & {
  storeName: string;
  ownerName: string;
  ownerEmail: string;
};

const storeStatusStyles: Record<VendorStoreStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-slate-200 text-slate-700",
};

const verificationStatusStyles: Record<VendorVerificationRecord["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("stores");
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [verifications, setVerifications] = useState<VerificationRow[]>([]);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");
    const { data: storeData, error: storeError } = await supabase.from("vendor_stores").select("id, owner_id, store_name, slug, campus, description, status").order("created_at", { ascending: false });
    if (storeError) {
      setError(storeError.message);
      setLoading(false);
      return;
    }

    const { data: verificationData, error: verificationError } = await supabase.from("vendor_verifications").select("id, vendor_id, matric_number, id_type, document_path, status, reviewer_notes, reviewed_by, created_at").order("created_at", { ascending: false });
    if (verificationError) {
      setError(verificationError.message);
      setLoading(false);
      return;
    }

    const ownerIds = Array.from(new Set((storeData ?? []).map((store) => String(store.owner_id))));
    const { data: profileData, error: profileError } = ownerIds.length > 0
      ? await supabase.from("profiles").select("id, full_name, email").in("id", ownerIds)
      : { data: [], error: null };
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const profiles = new Map((profileData ?? []).map((profile) => [String(profile.id), { name: String(profile.full_name || "Campus seller"), email: String(profile.email || "") }]));
    const storeMap = new Map<string, StoreRow>();
    const nextStores = (storeData ?? []).map((store) => {
      const owner = profiles.get(String(store.owner_id)) ?? { name: "Campus seller", email: "" };
      const row: StoreRow = { id: String(store.id), owner_id: String(store.owner_id), store_name: String(store.store_name), slug: String(store.slug), campus: String(store.campus), description: store.description ? String(store.description) : null, status: store.status as VendorStoreStatus, ownerName: owner.name, ownerEmail: owner.email };
      storeMap.set(row.id, row);
      return row;
    });
    const nextVerifications = (verificationData ?? []).map((verification) => {
      const store = storeMap.get(String(verification.vendor_id));
      const owner = store ? { name: store.ownerName, email: store.ownerEmail } : { name: "Campus seller", email: "" };
      return { ...(verification as VendorVerificationRecord), id: String(verification.id), vendor_id: String(verification.vendor_id), storeName: store?.store_name || "Unknown store", ownerName: owner.name, ownerEmail: owner.email };
    });

    setStores(nextStores);
    setVerifications(nextVerifications);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => { void load(); }, [load]);

  const filteredStores = useMemo(() => stores.filter((store) => `${store.store_name} ${store.ownerName} ${store.ownerEmail} ${store.campus}`.toLowerCase().includes(search.toLowerCase())), [stores, search]);
  const filteredVerifications = useMemo(() => verifications.filter((verification) => `${verification.storeName} ${verification.ownerName} ${verification.ownerEmail} ${verification.matric_number}`.toLowerCase().includes(search.toLowerCase())), [verifications, search]);

  if (authLoading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Checking admin access...</div>;
  if (!user || !isAdmin) return null;

  const updateStoreStatus = async (store: StoreRow, status: VendorStoreStatus) => {
    setActionId(store.id);
    const { error: updateError } = await supabase.from("vendor_stores").update({ status, updated_at: new Date().toISOString() }).eq("id", store.id);
    if (updateError) setError(updateError.message);
    else await load();
    setActionId(null);
  };

  const updateVerification = async (verification: VerificationRow, status: VendorVerificationRecord["status"]) => {
    setActionId(verification.id);
    const { error: updateError } = await supabase.from("vendor_verifications").update({ status, reviewer_notes: notes[verification.id]?.trim() || null, reviewed_by: user.id }).eq("id", verification.id);
    if (updateError) setError(updateError.message);
    else await load();
    setActionId(null);
  };

  const inspectDocument = async (path: string) => {
    setActionId(path);
    const { data, error: urlError } = await supabase.storage.from("verification-documents").createSignedUrl(path, 600);
    if (urlError) setError(urlError.message);
    else setPreviewUrl(data.signedUrl);
    setActionId(null);
  };

  return <div className="page-shell py-8 sm:py-12"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Restricted workspace</p><h1 className="mt-2 page-title">Vendor review</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Review campus stores and identity submissions using the Supabase-backed approval workflow.</p></div><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} /> Refresh data</Button></div>{error && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="surface-card p-5"><Store className="h-5 w-5 text-brand-orange" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Stores</p><p className="mt-1 font-display text-3xl font-semibold text-brand-navy">{stores.length}</p></div><div className="surface-card p-5"><Clock3 className="h-5 w-5 text-brand-orange" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Pending stores</p><p className="mt-1 font-display text-3xl font-semibold text-brand-navy">{stores.filter((store) => store.status === "pending").length}</p></div><div className="surface-card p-5"><ShieldCheck className="h-5 w-5 text-brand-orange" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Pending verification</p><p className="mt-1 font-display text-3xl font-semibold text-brand-navy">{verifications.filter((verification) => verification.status === "pending").length}</p></div></div><div className="mt-8 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2"><Button variant={tab === "stores" ? "default" : "outline"} onClick={() => setTab("stores")}>Stores</Button><Button variant={tab === "verifications" ? "default" : "outline"} onClick={() => setTab("verifications")}>Verifications</Button></div><div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search vendor reviews" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stores, sellers or matric numbers" className="pl-10" /></div></div>{tab === "stores" ? <section className="mt-6 space-y-3">{filteredStores.map((store) => <article key={store.id} className="surface-card p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-semibold text-brand-navy">{store.store_name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${storeStatusStyles[store.status]}`}>{store.status}</span></div><p className="mt-1 text-sm text-muted-foreground">{store.ownerName} · {store.ownerEmail || "No email"} · {store.campus}</p>{store.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{store.description}</p>}<p className="mt-2 text-xs text-muted-foreground">/{store.slug}</p></div><div className="flex flex-wrap gap-2">{store.status !== "approved" && <Button size="sm" onClick={() => void updateStoreStatus(store, "approved")} disabled={actionId === store.id}><CheckCircle2 /> Approve</Button>}{store.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => void updateStoreStatus(store, "rejected")} disabled={actionId === store.id}><XCircle /> Reject</Button>}{store.status !== "suspended" && <Button size="sm" variant="outline" onClick={() => void updateStoreStatus(store, "suspended")} disabled={actionId === store.id}>Suspend</Button>}</div></div></article>)}{!loading && filteredStores.length === 0 && <div className="surface-card p-8 text-center text-sm text-muted-foreground">No vendor stores match this search.</div>}</section> : <section className="mt-6 space-y-3">{filteredVerifications.map((verification) => <article key={verification.id} className="surface-card p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-semibold text-brand-navy">{verification.storeName}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${verificationStatusStyles[verification.status]}`}>{verification.status}</span></div><p className="mt-1 text-sm text-muted-foreground">{verification.ownerName} · {verification.ownerEmail || "No email"}</p><p className="mt-2 text-sm text-brand-navy">{verification.id_type.replace("_", " ")} · {verification.matric_number}</p>{verification.reviewer_notes && <p className="mt-2 text-sm text-muted-foreground">Previous note: {verification.reviewer_notes}</p>}</div><div className="flex flex-wrap gap-2">{verification.document_path && <Button size="sm" variant="outline" onClick={() => void inspectDocument(verification.document_path)} disabled={actionId === verification.document_path}><FileText /> Inspect document</Button>}{verification.status !== "verified" && <Button size="sm" onClick={() => void updateVerification(verification, "verified")} disabled={actionId === verification.id}><CheckCircle2 /> Verify</Button>}{verification.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => void updateVerification(verification, "rejected")} disabled={actionId === verification.id}><XCircle /> Reject</Button>}</div></div><div className="mt-4 max-w-xl"><label className="field-label" htmlFor={`reviewer-note-${verification.id}`}>Reviewer note <span className="font-normal text-muted-foreground">(optional)</span></label><textarea id={`reviewer-note-${verification.id}`} value={notes[verification.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [verification.id]: event.target.value }))} rows={2} placeholder="Add context for the seller if needed." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div></article>)}{!loading && filteredVerifications.length === 0 && <div className="surface-card p-8 text-center text-sm text-muted-foreground">No verification submissions match this search.</div>}</section>}{previewUrl && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Verification document preview"><div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><h2 className="font-display font-semibold text-brand-navy">Verification document</h2><div className="flex gap-2"><a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-input px-3 text-sm font-semibold text-brand-navy hover:bg-muted"><ExternalLink className="h-4 w-4" />Open</a><Button variant="outline" onClick={() => setPreviewUrl(null)}>Close</Button></div></div><iframe title="Verification document preview" src={previewUrl} className="h-[70vh] w-full rounded-lg border border-border" /></div></div>}</div>;
}
