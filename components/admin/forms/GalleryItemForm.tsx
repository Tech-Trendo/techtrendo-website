"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminGalleryItem } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";

interface GalleryItemFormProps {
  mode: "create" | "edit";
  item?: AdminGalleryItem | null;
}

export default function GalleryItemForm({ mode, item }: GalleryItemFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [size, setSize] = useState<"small" | "big">(item?.size ?? "small");
  const [image, setImage] = useState<File | null>(null);
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
      const payload: Record<string, unknown> = { title: title.trim(), size };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/gallery-items/${item.id}` : "/api/admin/gallery-items";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Gallery item updated." : "Gallery item created.");
      router.push("/admin/gallery-items");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Gallery Item" : "New Gallery Item"}
      backHref="/admin/gallery-items"
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
          <label className="block text-sm font-medium mb-1">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value as "small" | "big")} className={inputClassName()}>
            <option value="small">Small</option>
            <option value="big">Big</option>
          </select>
        </div>
        <ImageField label="Image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={title} />
      </section>
    </AdminForm>
  );
}
