export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder?: string;
  asset_folder?: string;
}

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

export async function uploadProductImageToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  if (!allowedTypes.has(file.type)) throw new Error("Product images must be JPG, PNG, or WEBP files.");
  if (file.size > maxFileSize) throw new Error("Product images must be 5MB or smaller.");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error("Cloudinary upload settings are missing.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
  const result: unknown = await response.json();
  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "object" && result.error !== null && "message" in result.error ? String(result.error.message) : "Cloudinary upload failed.";
    throw new Error(message);
  }
  return result as CloudinaryUploadResponse;
}
