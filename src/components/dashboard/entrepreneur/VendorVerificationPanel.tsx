import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, FileText, Loader2, UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { VerificationIdType, VendorVerificationRecord } from "@/types/vendor";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

const verificationStatus = (status: VendorVerificationRecord["status"]) => {
  if (status === "verified") return { label: "Verified", className: "bg-green-100 text-green-700", icon: CheckCircle2 };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-100 text-red-700", icon: XCircle };
  return { label: "Pending review", className: "bg-amber-100 text-amber-800", icon: Clock3 };
};

export default function VendorVerificationPanel() {
  const { user, isVendor, vendorStore } = useAuth();
  const [latest, setLatest] = useState<VendorVerificationRecord | null>(null);
  const [matricNumber, setMatricNumber] = useState("");
  const [idType, setIdType] = useState<VerificationIdType>("student_id");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const vendorStoreId = vendorStore?.id;

  useEffect(() => {
    if (!vendorStoreId) {
      setLatest(null);
      return;
    }
    let active = true;
    setLoadingLatest(true);
    supabase.from("vendor_verifications").select("id, vendor_id, matric_number, id_type, document_path, status, reviewer_notes, reviewed_by, created_at").eq("vendor_id", vendorStoreId).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data, error }) => {
      if (active && !error) setLatest(data as VendorVerificationRecord | null);
      if (active) setLoadingLatest(false);
    });
    return () => { active = false; };
  }, [vendorStoreId]);

  if (!isVendor || !user || !vendorStore) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!matricNumber.trim() || !file) {
      toast.error("Add your matric number and verification document.");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Upload a JPG, PNG, or PDF file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Verification documents must be 5MB or smaller.");
      return;
    }

    setLoading(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    try {
      const { error: uploadError } = await supabase.storage.from("verification-documents").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("vendor_verifications").insert({ vendor_id: vendorStore.id, matric_number: matricNumber.trim(), id_type: idType, document_path: path, status: "pending" });
      if (insertError) {
        await supabase.storage.from("verification-documents").remove([path]);
        throw insertError;
      }
      const { data } = await supabase.from("vendor_verifications").select("id, vendor_id, matric_number, id_type, document_path, status, reviewer_notes, reviewed_by, created_at").eq("vendor_id", vendorStore.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      setLatest(data as VendorVerificationRecord | null);
      setFile(null);
      toast.success("Verification submitted for review.");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "We could not submit your verification.");
    } finally {
      setLoading(false);
    }
  };

  const status = latest ? verificationStatus(latest.status) : null;
  const StatusIcon = status?.icon;

  return <section className="surface-card space-y-6 p-6 sm:p-8"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white"><FileText className="h-5 w-5" /></div><div><p className="eyebrow">Seller verification</p><h2 className="mt-1 font-display text-xl font-semibold text-brand-navy">Verify your campus business</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Submit one clear identity document so an admin can review your seller account.</p></div></div>{loadingLatest ? <p className="text-sm text-muted-foreground">Loading your latest submission...</p> : latest && status && StatusIcon ? <div className="rounded-lg border border-border bg-muted/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-brand-navy">Latest submission</p><p className="mt-1 text-xs text-muted-foreground">{latest.id_type.replace("_", " ")} · {latest.matric_number}</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}><StatusIcon className="h-3.5 w-3.5" />{status.label}</span></div>{latest.status === "rejected" && latest.reviewer_notes && <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Reviewer note: {latest.reviewer_notes}</p>}</div> : null}<form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="matric-number">Matric number</label><Input id="matric-number" value={matricNumber} onChange={(event) => setMatricNumber(event.target.value)} placeholder="e.g. 2023/12345" required /></div><div><label className="field-label" htmlFor="verification-id-type">Document type</label><select id="verification-id-type" value={idType} onChange={(event) => setIdType(event.target.value as VerificationIdType)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="student_id">Student ID</option><option value="nin">NIN</option><option value="voters_card">Voter&apos;s card</option><option value="passport">Passport</option></select></div><div className="sm:col-span-2"><label className="field-label" htmlFor="verification-document">Identity document</label><label htmlFor="verification-document" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/20 px-4 py-4 text-sm text-muted-foreground hover:border-brand-orange"><UploadCloud className="h-5 w-5 text-brand-orange" /><span>{file ? file.name : "Choose JPG, PNG, or PDF (max 5MB)"}</span><input id="verification-document" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" /></label></div><div className="sm:col-span-2"><Button type="submit" disabled={loading}>{loading && <Loader2 className="animate-spin" />}Submit verification</Button></div></form></section>;
}
