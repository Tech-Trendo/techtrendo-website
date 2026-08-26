"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminBlogCategory } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";

interface BlogCategoryFormProps {
  mode: "create" | "edit";
  item?: AdminBlogCategory | null;
}

export default function BlogCategoryForm({ mode, item }: BlogCategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = { name: name.trim() };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/blog-categories/${item.id}` : "/api/admin/blog-categories";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload);
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Category updated." : "Category created.");
      router.push("/dash/blog-categories");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Blog Category" : "New Blog Category"}
      backHref="/dash/blog-categories"
      submitLabel={mode === "edit" ? "Save changes" : "Create category"}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className={inputClassName()}
            placeholder="e.g. Technology"
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
            placeholder="auto-generated from name"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to auto-generate. Public URL: /blog?category={slug || "..."}
          </p>
        </div>
      </section>
    </AdminForm>
  );
}
