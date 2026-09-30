import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ShieldCheck,
  Clock,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  Sparkles,
  Award,
  Store,
  CreditCard,
  FileText,
  Share2,
  Globe,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { updateUser, type UserRecord, type VerificationStatus } from "@/utils/userStorage";
import { toast } from "sonner";
import ImageUploader, { fileToResizedDataUrl } from "@/components/common/ImageUploader";

const BUSINESS_CATEGORIES = [
  "Fashion & Thrift Store",
  "Tech, Gadgets & Phone Repairs",
  "Bakery, Pastries & Food",
  "Graphic Design & Tech Services",
  "Hair, Cosmetics & Grooming",
  "Books, Stationery & Academics",
  "Photography & Media",
  "Handmade Crafts & Accessories",
  "General Retail / Other",
];

const ID_TYPES = [
  "National ID (NIN)",
  "Student ID Card",
  "Driver's License",
  "Voter's Card",
  "International Passport",
  "CAC Business Certificate / Reg",
];

const NIGERIAN_BANKS = [
  "OPay",
  "Palmpay",
  "Kuda Bank",
  "Moniepoint",
  "GTBank (Guaranty Trust)",
  "Access Bank",
  "Zenith Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Fidelity Bank",
  "Wema Bank / ALAT",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Other Bank",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Section 1: Personal Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  // Section 2: Delivery & Pickup Address
  const [streetAddress, setStreetAddress] = useState("");
  const [cityTown, setCityTown] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [landmark, setLandmark] = useState("");

  // Section 3: Seller Business & Verification Details
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Fashion & Thrift Store");
  const [bio, setBio] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("Under 1 year");

  // Identification credentials
  const [idType, setIdType] = useState("National ID (NIN)");
  const [idNumber, setIdNumber] = useState("");
  const [idImages, setIdImages] = useState<string[]>([]);

  // Payout / Bank details
  const [bankName, setBankName] = useState("OPay");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const load = async () => {
    const current = await getCurrentUser();
    if (current) {
      setUser(current);
      setName(current.name || "");
      setPhone(current.phone || "");
      setAvatar(current.avatar_url || "");

      // Address
      setStreetAddress(current.address || current.hostel || "");
      setCityTown(current.campus || "");
      setStateRegion(current.department || "");
      setLandmark(current.landmark || "");

      // Business & Verification
      setBusinessName(current.business_name || "");
      setBusinessCategory(current.business_category || "Fashion & Thrift Store");
      setBio(current.bio || "");
      setSocialHandle(current.social_handle || "");
      setYearsInBusiness(current.years_in_business || "Under 1 year");

      setIdType(current.id_type || "National ID (NIN)");
      setIdNumber(current.id_number || current.student_id_number || "");
      setIdImages(current.id_card_image ? [current.id_card_image] : []);

      setBankName(current.bank_name || "OPay");
      setAccountNumber(current.account_number || "");
      setAccountName(current.account_name || "");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await fileToResizedDataUrl(file, 400, 0.85);
      setAvatar(resized);
    } catch (err) {
      toast.error("Failed to upload avatar image");
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = updateUser(user.id, {
        name: name.trim() || user.name,
        phone: phone.trim(),
        avatar_url: avatar,
        address: streetAddress.trim(),
        hostel: streetAddress.trim(),
        campus: cityTown.trim(),
        department: stateRegion.trim(),
        landmark: landmark.trim(),
        business_name: businessName.trim(),
        business_category: businessCategory,
        bio: bio.trim(),
        social_handle: socialHandle.trim(),
        years_in_business: yearsInBusiness,
        id_type: idType,
        id_number: idNumber.trim(),
        student_id_number: idNumber.trim(),
        id_card_image: idImages[0] || "",
        bank_name: bankName,
        account_number: accountNumber.trim(),
        account_name: accountName.trim(),
      });
      setUser(updated);
      toast.success("Profile details saved successfully! ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerification = () => {
    if (!user) return;
    if (!phone || !cityTown) {
      toast.error("Please fill in your Phone Number and Location/Town.");
      return;
    }
    if (user.role === "entrepreneur" && (!idNumber || !accountNumber)) {
      toast.error("Please provide your ID Number and Payout Account Number for seller verification.");
      return;
    }

    setSaving(true);
    try {
      const updated = updateUser(user.id, {
        name: name.trim() || user.name,
        phone: phone.trim(),
        avatar_url: avatar,
        address: streetAddress.trim(),
        hostel: streetAddress.trim(),
        campus: cityTown.trim(),
        department: stateRegion.trim(),
        landmark: landmark.trim(),
        business_name: businessName.trim(),
        business_category: businessCategory,
        bio: bio.trim(),
        social_handle: socialHandle.trim(),
        years_in_business: yearsInBusiness,
        id_type: idType,
        id_number: idNumber.trim(),
        student_id_number: idNumber.trim(),
        id_card_image: idImages[0] || "",
        bank_name: bankName,
        account_number: accountNumber.trim(),
        account_name: accountName.trim(),
        verification_status: "pending",
        verification_requested_at: new Date().toISOString(),
      });
      setUser(updated);
      toast.success("Verification request submitted to Admin! 🛡️");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit verification request");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Admin routing
  if (user.role === "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-border text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center text-2xl font-bold shadow-md">
            👑
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-brand-navy">Administrator Account</h1>
            <p className="text-xs text-muted-foreground">
              Admins manage community accounts, product moderation, and verifications via the Admin Control Panel.
            </p>
          </div>
          <Button
            asChild
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl h-12 shadow-md shadow-brand-orange/25"
          >
            <Link to="/admin">Open Admin Control Panel</Link>
          </Button>
        </div>
      </div>
    );
  }

  const vStatus: VerificationStatus = user.verification_status || "unverified";

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          {/* Avatar with Modern Camera Plus Button */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-brand-navy flex items-center justify-center text-white text-3xl font-bold">
              {avatar ? (
                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user.name?.[0]?.toUpperCase() || "U"}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-brand-orange text-white shadow-lg cursor-pointer hover:bg-brand-orange/90 hover:scale-110 active:scale-95 transition">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* User Details & Verification Badge */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                {businessName ? `${businessName} (${user.name})` : user.name}
              </h1>

              {/* Dynamic Verification Badge */}
              {vStatus === "verified" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Verified {user.role === "entrepreneur" ? "Seller" : "Member"}
                </span>
              )}

              {vStatus === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20 animate-pulse">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Verification Pending
                </span>
              )}

              {vStatus === "unverified" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Unverified
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-brand-navy text-white capitalize">
                {user.role === "entrepreneur" ? "Seller / Business" : "Customer / Buyer"}
              </span>
              {cityTown && (
                <span className="text-xs font-medium px-3 py-1 rounded-lg bg-muted text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  {cityTown}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* VERIFICATION BANNER */}
        {vStatus === "unverified" && (
          <div className="bg-orange-50 border border-brand-orange/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-brand-orange/20 text-brand-orange shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-brand-navy">
                  Get Your Verified Badge 🛡️
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {user.role === "entrepreneur"
                    ? "Verified sellers get 3x more order requests, priority listing placement, and customer trust."
                    : "Verified members get trusted buyer status and smooth campus & town transactions."}
                </p>
              </div>
            </div>
            <Button
              onClick={handleRequestVerification}
              disabled={saving}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs whitespace-nowrap px-5 rounded-2xl"
            >
              Submit for Verification
            </Button>
          </div>
        )}

        {vStatus === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-center gap-3.5 text-amber-800 text-sm">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
            <div>
              <p className="font-bold">Verification Under Review</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Our administration team is reviewing your profile and credentials. Your verified badge will appear once approved.
              </p>
            </div>
          </div>
        )}

        {vStatus === "verified" && (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-6 flex items-center gap-3.5 text-green-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold">You are a Verified Member!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your profile displays the official verified badge across all marketplace listings and chat messages.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 1: PERSONAL & CONTACT DETAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <User className="w-5 h-5 text-brand-orange" />
            <h2 className="text-lg font-bold text-brand-navy">
              1. Personal &amp; Contact Details
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rosemary Dauda"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Phone / WhatsApp Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 812 345 6789"
                className="rounded-xl h-11"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DELIVERY / PICKUP LOCATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <MapPin className="w-5 h-5 text-brand-orange" />
            <h2 className="text-lg font-bold text-brand-navy">
              2. Delivery / Pickup Location
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Street / Area / Shop / Campus Address</label>
              <Input
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. 14 Commercial Avenue, Yaba / Hall Block 4"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">City / Town / Campus Area</label>
              <Input
                value={cityTown}
                onChange={(e) => setCityTown(e.target.value)}
                placeholder="e.g. Yaba / Akoka / UNILAG Area"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">State / Region</label>
              <Input
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                placeholder="e.g. Lagos State"
                className="rounded-xl h-11"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Popular Landmark / Preferred Pickup Spot</label>
              <Input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Total Filling Station / University Main Library"
                className="rounded-xl h-11"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SELLER & BUSINESS VERIFICATION DETAILS (Required for Sellers, Optional for Buyers) */}
        {user.role === "entrepreneur" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
              <Store className="w-5 h-5 text-brand-orange" />
              <div>
                <h2 className="text-lg font-bold text-brand-navy">
                  3. Seller &amp; Business Verification Details
                </h2>
                <p className="text-xs text-muted-foreground">
                  Required by admin for verifying your seller account and awarding the verified badge.
                </p>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Store / Brand Name</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Rose &amp; Co. Thrift &amp; Bakery"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Primary Business Category</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Social Media / WhatsApp Business Handle</label>
                <Input
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="e.g. @rose_thrift_store / IG or TikTok"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Experience / Operating Duration</label>
                <select
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                >
                  <option value="Under 6 months">Under 6 months</option>
                  <option value="6 months - 1 year">6 months - 1 year</option>
                  <option value="1 - 2 years">1 - 2 years</option>
                  <option value="2+ years">2+ years</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Store Bio / Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe what you sell, your turnaround time, warranty, or delivery policies..."
                  rows={3}
                  className="w-full border border-input rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
                />
              </div>
            </div>

            {/* Identification & Document Upload */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span>Identity Document Verification</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Identification Type</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                  >
                    {ID_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Document ID / Reg Number</label>
                  <Input
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. 11-digit NIN or Student/Govt ID #"
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* ID Card Image Upload */}
              <div className="pt-2">
                <ImageUploader
                  images={idImages}
                  onChange={setIdImages}
                  multiple={false}
                  label="Upload Photo of ID Document / Business Card"
                  helperText="Clear photo of the ID card or store banner for verification review"
                />
              </div>
            </div>

            {/* Payout Bank Details */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
                <CreditCard className="w-4 h-4 text-brand-orange" />
                <span>Seller Payout / Bank Verification</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Account Number</label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="10-digit NUBAN"
                    maxLength={10}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Account Name</label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. Rosemary Dauda"
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {vStatus !== "verified" && (
            <Button
              variant="outline"
              onClick={handleRequestVerification}
              disabled={saving}
              className="w-full sm:w-auto border-brand-orange text-brand-orange hover:bg-orange-50 font-bold h-12 px-6 rounded-2xl"
            >
              Submit for Verification Badge
            </Button>
          )}

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy/90 text-white font-bold h-12 px-8 rounded-2xl shadow-md"
          >
            {saving ? "Saving Changes..." : "Save All Details"}
          </Button>
        </div>

      </div>
    </div>
  );
}
