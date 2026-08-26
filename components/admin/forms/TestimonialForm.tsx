"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminTestimonial } from "@/lib/admin-types";
import { apiErrorText, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";

interface TestimonialFormProps {
  mode: "create" | "edit";
  item?: AdminTestimonial | null;
  /** Resource name for the API, e.g. "testimonials". */
  resource: string;
  /** Public label, e.g. "Testimonial". */
  label: string;
  /** Back link target. */
  backHref: string;
}

export default function TestimonialForm({ mode, item, resource, label, backHref }: TestimonialFormProps) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState(item?.author_name ?? "");
  const [text, setText] = useState(item?.text ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!authorName.trim() || !text.trim()) {
      setError("Author name and text are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = { author_name: authorName.trim(), text };
      const url = mode === "edit" && item ? `/api/admin/${resource}/${item.id}` : `/api/admin/${resource}`;
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { author_image: image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(`${label} ${mode === "edit" ? "updated" : "created"}.`);
      router.push(backHref);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={`${mode === "edit" ? "Edit" : "New"} ${label}`}
      backHref={backHref}
      submitLabel={mode === "edit" ? "Save changes" : `Create ${label.toLowerCase()}`}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div>
          <label className="block text-sm font-medium mb-1">
            Author name <span className="text-destructive">*</span>
          </label>
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={inputClassName()} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Text <span className="text-destructive">*</span>
          </label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className={inputClassName()} />
        </div>
        <ImageField
          label="Author image"
          existingUrl={resolveImageUrl(item?.author_image ?? null)}
          file={image}
          onChange={setImage}
          alt={authorName}
        />
      </section>
    </AdminForm>
  );
}
