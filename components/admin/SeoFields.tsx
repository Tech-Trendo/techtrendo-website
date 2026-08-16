"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClassName } from "@/components/admin/AdminForm";

interface SeoValues {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  canonical_url?: string | null;
}

interface SeoFieldsProps {
  values: SeoValues;
  onChange: (next: SeoValues) => void;
}

export default function SeoFields({ values, onChange }: SeoFieldsProps) {
  const [open, setOpen] = useState(false);

  const set = (key: keyof SeoValues, value: string) => onChange({ ...values, [key]: value });

  return (
    <section className="border border-border rounded-lg bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        SEO Settings
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meta title</label>
            <input value={values.meta_title ?? ""} onChange={(e) => set("meta_title", e.target.value)} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta description</label>
            <textarea value={values.meta_description ?? ""} onChange={(e) => set("meta_description", e.target.value)} rows={2} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta keywords</label>
            <input value={values.meta_keywords ?? ""} onChange={(e) => set("meta_keywords", e.target.value)} className={inputClassName()} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">OG title</label>
              <input value={values.og_title ?? ""} onChange={(e) => set("og_title", e.target.value)} className={inputClassName()} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">OG description</label>
              <input value={values.og_description ?? ""} onChange={(e) => set("og_description", e.target.value)} className={inputClassName()} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Canonical URL</label>
            <input value={values.canonical_url ?? ""} onChange={(e) => set("canonical_url", e.target.value)} className={inputClassName()} placeholder="https://techtrendo.com/..." />
          </div>
        </div>
      )}
    </section>
  );
}
