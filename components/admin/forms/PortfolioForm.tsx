"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminPortfolio } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";
import JsonListEditor from "@/components/admin/JsonListEditor";
import SeoFields from "@/components/admin/SeoFields";

const PORTFOLIO_TYPES = [
  { value: "mobile_app", label: "Mobile App" },
  { value: "website", label: "Website" },
  { value: "software", label: "Software" },
];

interface PortfolioFormProps {
  mode: "create" | "edit";
  item?: AdminPortfolio | null;
}

export default function PortfolioForm({ mode, item }: PortfolioFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [type, setType] = useState<AdminPortfolio["type"]>(item?.type ?? "website");
  const [description, setDescription] = useState(item?.description ?? "");
  const [points, setPoints] = useState(item?.points ?? "");
  const [results, setResults] = useState(item?.results ?? "");
  const [industryTags, setIndustryTags] = useState<unknown[]>(item?.industry_tags ?? []);
  const [regionTags, setRegionTags] = useState<unknown[]>(item?.region_tags ?? []);
  const [image, setImage] = useState<File | null>(null);
  const [seo, setSeo] = useState({
    meta_title: item?.meta_title,
    meta_description: item?.meta_description,
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
        type,
        description,
        points,
        results,
        industry_tags: industryTags,
        region_tags: regionTags,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/portfolio/${item.id}` : "/api/admin/portfolio";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Portfolio item updated." : "Portfolio item created.");
      router.push("/admin/portfolio");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Portfolio Item" : "New Portfolio Item"}
      backHref="/admin/portfolio"
      submitLabel={mode === "edit" ? "Save changes" : "Create item"}
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
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as AdminPortfolio["type"])} className={inputClassName()}>
            {PORTFOLIO_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClassName()} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Key points / features</label>
          <textarea value={points} onChange={(e) => setPoints(e.target.value)} rows={4} className={inputClassName()} placeholder="One point per line" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Results</label>
          <textarea value={results} onChange={(e) => setResults(e.target.value)} rows={3} className={inputClassName()} placeholder="e.g. 40% faster load time, 10k+ users" />
        </div>
        <ImageField label="Image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={title} />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Industry tags" value={industryTags} onChange={setIndustryTags} placeholder="e.g. Education, Health, E-commerce" />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Region tags" value={regionTags} onChange={setRegionTags} placeholder="e.g. Nepal, Australia, India, UAE, New Zealand" />
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
