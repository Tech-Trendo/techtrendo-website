"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminPage } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import SeoFields from "@/components/admin/SeoFields";

const PAGE_ROUTE_HINTS: Record<string, string> = {
  service: "/services",
  about: "/about",
  blog: "/blog",
  contact: "/contact",
  careers: "/careers",
  products: "/products",
  outsource: "/outsource",
  markets: "/markets",
};

interface PageFormProps {
  mode: "create" | "edit";
  item?: AdminPage | null;
}

export default function PageForm({ mode, item }: PageFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [content, setContent] = useState(item?.content ?? "");
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
        content,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        meta_keywords: seo.meta_keywords?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/pages/${item.id}` : "/api/admin/pages";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload);
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Page updated." : "Page created.");
      router.push("/admin/pages");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Page" : "New Page"}
      backHref="/admin/pages"
      submitLabel={mode === "edit" ? "Save changes" : "Create page"}
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
          {slug && PAGE_ROUTE_HINTS[slug] && (
            <p className="text-xs text-muted-foreground mt-1">Renders at: {PAGE_ROUTE_HINTS[slug]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (HTML)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className={inputClassName()} placeholder="HTML content rendered on the page" />
        </div>
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
