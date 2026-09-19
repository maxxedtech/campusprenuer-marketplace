import React, { useRef, useState } from "react";
import { Plus, X, Image as ImageIcon, UploadCloud } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export async function fileToResizedDataUrl(file: File, maxSize = 900, quality = 0.75): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function ImageUploader({
  images,
  onChange,
  multiple = false,
  maxImages = 4,
  label = "Upload Images",
  helperText = "PNG, JPG or WebP up to 5MB",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (fileList: FileList | File[]) => {
    setIsProcessing(true);
    try {
      const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
      const resizedList: string[] = [];

      for (const file of files) {
        if (!multiple && resizedList.length >= 1) break;
        if (multiple && images.length + resizedList.length >= maxImages) break;
        const data = await fileToResizedDataUrl(file);
        resizedList.push(data);
      }

      if (multiple) {
        onChange([...images, ...resizedList].slice(0, maxImages));
      } else if (resizedList.length > 0) {
        onChange([resizedList[0]]);
      }
    } catch (err) {
      console.error("Error resizing images:", err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const canAddMore = multiple ? images.length < maxImages : images.length === 0;

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-brand-navy">{label}</label>}

      {/* Grid of Preview Images & Add Button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-border shadow-sm bg-muted/30 flex items-center justify-center"
          >
            <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white shadow-md hover:bg-red-700 hover:scale-110 transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && multiple && (
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-navy/90 text-white">
                Main
              </span>
            )}
          </div>
        ))}

        {/* Modern Plus / Add Dropzone */}
        {canAddMore && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition-all aspect-square ${
              isDragging
                ? "border-brand-orange bg-orange-50/60 scale-[1.02]"
                : "border-gray-300 hover:border-brand-orange/70 hover:bg-orange-50/20 bg-muted/20"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
            <span className="text-xs font-bold text-brand-navy">
              {isProcessing ? "Processing..." : "Add Photo"}
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Click or drag</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => e.target.files && processFiles(e.target.files)}
        className="hidden"
      />

      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  );
}
