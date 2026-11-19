export type VendorStoreStatus = "pending" | "approved" | "rejected" | "suspended";

export type VendorVerificationStatus = "pending" | "verified" | "rejected";

export type VerificationIdType = "student_id" | "nin" | "voters_card" | "passport";

export interface VendorVerificationRecord {
  id: string;
  vendor_id: string;
  matric_number: string;
  id_type: VerificationIdType;
  document_path: string;
  status: VendorVerificationStatus;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  created_at: string;
}
