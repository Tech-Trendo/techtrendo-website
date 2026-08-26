"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import ReviewForm from "@/components/admin/forms/ReviewForm";
import type { AdminReview } from "@/lib/admin-types";

export default function AdminReviewEditPage() {
  return (
    <AdminEditPage<AdminReview>
      fetchUrl={(key) => `/api/admin/reviews/${encodeURIComponent(key)}`}
      backHref="/dash/reviews"
      backLabel="Back to reviews"
    >
      {(item) => <ReviewForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
