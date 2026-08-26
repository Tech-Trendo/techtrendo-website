"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminProduct } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";
import JsonListEditor from "@/components/admin/JsonListEditor";
import SeoFields from "@/components/admin/SeoFields";

interface ProductFormProps {
  mode: "create" | "edit";
  item?: AdminProduct | null;
}

const PAIR_FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", textarea: true },
];

export default function ProductForm({ mode, item }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [category, setCategory] = useState(item?.category ?? "");
  const [shortDescription, setShortDescription] = useState(item?.short_description ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [usecase, setUsecase] = useState<unknown[]>(item?.usecase ?? []);
  const [keyBenefits, setKeyBenefits] = useState<unknown[]>(item?.KeyBenefits ?? []);
  const [features, setFeatures] = useState<unknown[]>(item?.features ?? []);
  const [seo, setSeo] = useState({
    meta_title: item?.meta_title,
    meta_description: item?.meta_description,
    meta_keywords: item?.meta_keywords,
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
        category: category.trim() || "General",
        short_description: shortDescription.trim(),
        description,
        link: link.trim() || null,
        usecase,
        KeyBenefits: keyBenefits,
        features,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        meta_keywords: seo.meta_keywords?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/products/${item.slug}` : "/api/admin/products";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { image, icon });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Product updated." : "Product created.");
      router.push("/dash/products");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Product" : "New Product"}
      backHref="/dash/products"
      submitLabel={mode === "edit" ? "Save changes" : "Create product"}
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
            <label className="block text-sm font-medium mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputClassName()} placeholder="General" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} className={inputClassName()} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short description</label>
          <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClassName()} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClassName()} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageField label="Image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={title} />
          <ImageField label="Icon" existingUrl={resolveImageUrl(item?.icon ?? null)} file={icon} onChange={setIcon} alt={`${title} icon`} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Use cases" value={usecase} onChange={setUsecase} placeholder="e.g. Schools, Colleges, Coaching institutes" />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Key benefits" value={keyBenefits} onChange={setKeyBenefits} fields={PAIR_FIELDS} />
      </section>

      <section className="border border-border rounded-lg p-4 bg-card">
        <JsonListEditor label="Features" value={features} onChange={setFeatures} fields={PAIR_FIELDS} />
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
