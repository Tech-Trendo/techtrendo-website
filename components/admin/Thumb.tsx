"use client";

import { resolveImageUrl } from "@/components/admin/ImageField";

export default function Thumb({ src, alt }: { src: string | null; alt: string }) {
  const url = resolveImageUrl(src);
  if (!url) return null;
  return <img src={url} alt={alt} className="h-10 w-14 object-cover rounded border border-border" />;
}
