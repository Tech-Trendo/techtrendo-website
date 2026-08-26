"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminService } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";
import JsonListEditor from "@/components/admin/JsonListEditor";
import SeoFields from "@/components/admin/SeoFields";

interface ServiceFormProps {
  mode: "create" | "edit";
  item?: AdminService | null;
}

const PAIR_FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", textarea: true },
];

export default function ServiceForm({ mode, item }: ServiceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [shortDescription, setShortDescription] = useState(item?.short_description ?? "");
  const [longDescription, setLongDescription] = useState(item?.long_description ?? "");
  const [icon, setIcon] = useState(item?.icon ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [features, setFeatures] = useState<unknown[]>(item?.features ?? []);
  const [keybenefits, setKeybenefits] = useState<unknown[]>(item?.keybenefits ?? []);
  const [seo, setSeo] = useState({
    meta_title: item?.meta_title,
    meta_description: item?.meta_description,
    meta_keywords: item?.meta_keywords,
    og_title: item?.og_title,
    og_description: item?.og_description,
    canonical_url: item?.canonical_url,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        short_description: shortDescription.trim(),
        long_description: longDescription,
        icon: icon.trim() || null,
        features,
        keybenefits,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        meta_keywords: seo.meta_keywords?.trim() || null,
        og_title: seo.og_title?.trim() || null,
        og_description: seo.og_description?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/services/${item.slug}` : "/api/admin/services";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Service updated." : "Service created.");
      router.push("/dash/services");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Service" : "New Service"}
      backHref="/dash/services"
      submitLabel={mode === "edit" ? "Save changes" : "Create service"}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className={inputClassName()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value);
            }}
            className={inputClassName()}
            placeholder="auto-generated from title"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Icon (Lucide name)</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputClassName()} placeholder="e.g. Code, Cloud, Database" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short description</label>
            <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClassName()} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Long description</label>
          <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={5} className={inputClassName()} />
        </div>
        <ImageField label="Image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={title} />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Features" value={features} onChange={setFeatures} fields={PAIR_FIELDS} />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Key benefits" value={keybenefits} onChange={setKeybenefits} fields={PAIR_FIELDS} />
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
