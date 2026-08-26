"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminReview } from "@/lib/admin-types";
import { apiErrorText, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";

interface ReviewFormProps {
  mode: "create" | "edit";
  item?: AdminReview | null;
}

export default function ReviewForm({ mode, item }: ReviewFormProps) {
  const router = useRouter();
  const [reviewerName, setReviewerName] = useState(item?.reviewerName ?? "");
  const [reviewerRole, setReviewerRole] = useState(item?.reviewerRole ?? "");
  const [review, setReview] = useState(item?.review ?? "");
  const [reviewerWebsite, setReviewerWebsite] = useState(item?.reviewerWebsite ?? "");
  const [reviewerImage, setReviewerImage] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reviewerName.trim() || !reviewerRole.trim() || !review.trim()) {
      setError("Reviewer name, role and review are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        reviewerName: reviewerName.trim(),
        reviewerRole: reviewerRole.trim(),
        review,
        reviewerWebsite: reviewerWebsite.trim() || null,
      };
      const url = mode === "edit" && item ? `/api/admin/reviews/${item.id}` : "/api/admin/reviews";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload, {
        reviewerImage,
        reviewerCompanyLogo: companyLogo,
      });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Review updated." : "Review created.");
      router.push("/dash/reviews");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Review" : "New Review"}
      backHref="/dash/reviews"
      submitLabel={mode === "edit" ? "Save changes" : "Create review"}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Reviewer name <span className="text-destructive">*</span>
            </label>
            <input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className={inputClassName()} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Reviewer role <span className="text-destructive">*</span>
            </label>
            <input value={reviewerRole} onChange={(e) => setReviewerRole(e.target.value)} className={inputClassName()} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Review <span className="text-destructive">*</span>
          </label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={4} className={inputClassName()} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reviewer website</label>
          <input value={reviewerWebsite} onChange={(e) => setReviewerWebsite(e.target.value)} className={inputClassName()} placeholder="https://..." />
        </div>
        <ImageField label="Reviewer image" existingUrl={resolveImageUrl(item?.reviewerImage ?? null)} file={reviewerImage} onChange={setReviewerImage} />
        <ImageField label="Company logo" existingUrl={resolveImageUrl(item?.reviewerCompanyLogo ?? null)} file={companyLogo} onChange={setCompanyLogo} />
      </section>
    </AdminForm>
  );
}
