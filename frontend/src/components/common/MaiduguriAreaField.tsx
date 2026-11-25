import { Input } from "@/components/ui/input";

export const MAIDUGURI_AREAS = ["UNIMAID (University of Maiduguri)", "KIU (Kashim Ibrahim University / Borno State University)", "Baga Road", "Polo / Old GRA", "New GRA", "Custom / Gwange", "Post Office / Monday Market", "Bulumkutu / Airport Road", "Mairi / Dalori", "Gomari / Damboa Road", "Other Maiduguri Area"] as const;

export function MaiduguriAreaField({ id, value, onChange, label = "Area / Jurisdiction" }: { id: string; value: string; onChange: (value: string) => void; label?: string }) {
  const known = MAIDUGURI_AREAS.find((area) => area === value);
  const other = !known || known === "Other Maiduguri Area";
  return <div><label className="field-label" htmlFor={id}>{label}</label><select id={id} value={known || "Other Maiduguri Area"} onChange={(event) => onChange(event.target.value === "Other Maiduguri Area" ? "Other Maiduguri Area" : event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="">Select an area</option>{MAIDUGURI_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}</select>{other && <Input className="mt-2" aria-label="Custom Maiduguri area" placeholder="Enter your Maiduguri area" value={known === "Other Maiduguri Area" ? "" : value} onChange={(event) => onChange(event.target.value)} />}</div>;
}
