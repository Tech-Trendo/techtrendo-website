"use client";

import AdminGate from "@/components/admin/AdminGate";
import ReviewForm from "@/components/admin/forms/ReviewForm";

export default function AdminReviewNewPage() {
  return (
    <AdminGate>
      <ReviewForm mode="create" />
    </AdminGate>
  );
}
