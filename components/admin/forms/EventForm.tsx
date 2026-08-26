"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminEvent } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";
import SeoFields from "@/components/admin/SeoFields";

function toDateInput(value?: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

interface EventFormProps {
  mode: "create" | "edit";
  item?: AdminEvent | null;
}

export default function EventForm({ mode, item }: EventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [description, setDescription] = useState(item?.description ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [date, setDate] = useState(toDateInput(item?.date));
  const [image, setImage] = useState<File | null>(null);
  const [seo, setSeo] = useState({ meta_title: item?.meta_title, meta_description: item?.meta_description });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim()) {
      setError("Title and location are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description,
        location: location.trim(),
        date: date || null,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/events/${item.id}` : "/api/admin/events";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Event updated." : "Event created.");
      router.push("/dash/events");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Event" : "New Event"}
      backHref="/dash/events"
      submitLabel={mode === "edit" ? "Save changes" : "Create event"}
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
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-destructive">*</span>
            </label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClassName()} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClassName()} />
        </div>
        <ImageField label="Image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={title} />
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
