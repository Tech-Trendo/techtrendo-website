"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminJob } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";
import JsonListEditor from "@/components/admin/JsonListEditor";
import SeoFields from "@/components/admin/SeoFields";

function toDateInput(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

interface CareersFormProps {
  resource: "jobs" | "interns";
  label: string;
  mode: "create" | "edit";
  item?: AdminJob | null;
}

export default function CareersForm({ resource, label, mode, item }: CareersFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [location, setLocation] = useState(item?.location ?? "");
  const [type, setType] = useState(item?.type ?? "Full-time");
  const [duration, setDuration] = useState(item?.duration ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [requirements, setRequirements] = useState<string[]>(item?.requirements ?? []);
  const [qualifications, setQualifications] = useState(item?.qualifications ?? "");
  const [deadline, setDeadline] = useState(toDateInput(item?.deadline));
  const [datePosted, setDatePosted] = useState(toDateInput(item?.date_posted));
  const [status, setStatus] = useState(item?.status ?? "OPEN");
  const [img, setImg] = useState<File | null>(null);
  const [seo, setSeo] = useState({ meta_title: item?.meta_title, meta_description: item?.meta_description });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePath = `/dash/${resource}`;

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !type.trim()) {
      setError("Title, location and type are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        location: location.trim(),
        type: type.trim(),
        duration: duration.trim() || null,
        description,
        requirements,
        qualifications,
        deadline: deadline || null,
        status,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
      };
      if (datePosted) payload.date_posted = datePosted;
      if (slug.trim()) payload.slug = slug.trim();
      const url =
        mode === "edit" && item
          ? `/api/admin/${resource}/${item.id}`
          : `/api/admin/${resource}`;
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, { img });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? `${label} updated.` : `${label} created.`);
      router.push(basePath);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? `Edit ${label}` : `New ${label}`}
      backHref={basePath}
      submitLabel={mode === "edit" ? "Save changes" : `Create ${label.toLowerCase()}`}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div className="grid sm:grid-cols-2 gap-4">
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
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-destructive">*</span>
            </label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Type <span className="text-destructive">*</span>
            </label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Full-time, Part-time, Remote..."
              className={inputClassName()}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 months"
              className={inputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date posted</label>
            <input type="date" value={datePosted} onChange={(e) => setDatePosted(e.target.value)} className={inputClassName()} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as AdminJob["status"])} className={inputClassName()}>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClassName()} />
        </div>
        <JsonListEditor
          label="Requirements (one per line)"
          value={requirements}
          onChange={(next) => setRequirements(next as string[])}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Qualifications</label>
          <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows={4} className={inputClassName()} />
        </div>
        <ImageField label="Image" existingUrl={resolveImageUrl(item?.img ?? null)} file={img} onChange={setImg} alt={title} />
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
