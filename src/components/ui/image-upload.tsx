"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export function ImageUpload({ value, onChange, bucket = "products" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError("");

      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
      
      onChange(publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      } else if (file) {
        setError("Hanya file gambar yang diperbolehkan");
      }
    },
    [bucket]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  if (value) {
    return (
      <div className="relative flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 p-2 h-40 group bg-slate-50 dark:bg-slate-900/50">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <Image src={value} alt="Uploaded preview" fill className="object-contain" />
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 h-40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer relative"
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#ef85f8]" />
            <span className="text-sm">Mengunggah...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <span className="text-sm font-medium">Seret & Lepas Gambar</span>
            <span className="text-xs text-slate-400">Atau klik untuk memilih file</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
