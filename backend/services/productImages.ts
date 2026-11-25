import { supabase } from "@backend/supabase/client";

export const PRODUCT_IMAGE_BUCKET = "product-images";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

function storageErrorMessage(error: unknown) {
  const value = error as { message?: unknown; code?: unknown; statusCode?: unknown; status?: unknown };
  const message = typeof value?.message === "string" ? value.message : "Supabase Storage upload failed.";
  const code = String(value?.code ?? "");
  const status = String(value?.statusCode ?? value?.status ?? "");

  if (code === "NoSuchBucket" || /bucket not found/i.test(message)) {
    return `Supabase Storage bucket "${PRODUCT_IMAGE_BUCKET}" was not found in the configured project. Create that bucket before uploading product images.`;
  }
  if (status === "401" || status === "403" || /row-level security|not authorized|permission denied/i.test(message)) {
    return `Product image upload was denied by Supabase Storage. Check the INSERT policy on storage.objects for bucket "${PRODUCT_IMAGE_BUCKET}" and authenticated users.`;
  }
  if (/already exists|duplicate/i.test(message)) {
    return "A product image with this path already exists. Choose the file again and retry.";
  }
  return message;
}

export async function uploadProductImage(userId: string, file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("Product images must be JPG, PNG, or WEBP files.");
  if (file.size > maxFileSize) throw new Error("Product images must be 5MB or smaller.");

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user || sessionData.session.user.id !== userId) {
    throw new Error("Your sign-in session is missing or expired. Sign in again before uploading a product image.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { data, error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("Supabase product image upload failed:", error);
    throw new Error(storageErrorMessage(error));
  }
  if (!data?.path) throw new Error("Supabase accepted the image upload but did not return an object path.");

  const { data: publicUrlData } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(data.path);
  if (!publicUrlData.publicUrl) throw new Error("Supabase uploaded the image but did not return a public URL.");
  return { path: data.path, publicUrl: publicUrlData.publicUrl };
}

export async function removeProductImage(path: string) {
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([path]);
  if (error) console.error("Could not clean up product image:", error);
}
