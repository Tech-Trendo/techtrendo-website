"use client";

import { useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

interface ImageFieldProps {
  label: string;
  existingUrl: string | null;
  file: File | null;
  onChange: (file: File | null) => void;
  alt?: string;
}

export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
}

export default function ImageField({ label, existingUrl, file, onChange, alt }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const resolved = preview ?? resolveImageUrl(existingUrl);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-start gap-4 flex-wrap">
        {resolved ? (
          <img
            src={preview ?? resolved}
            alt={alt ?? label}
            className="w-40 h-28 object-cover rounded-md border border-border"
          />
        ) : (
          <div className="w-40 h-28 rounded-md border border-dashed border-muted-foreground/40 flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              onChange(next);
              setPreview(next ? URL.createObjectURL(next) : null);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 text-sm rounded-md border border-input hover:bg-muted"
          >
            {file ? "Replace chosen file" : "Upload image"}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="ml-2 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
