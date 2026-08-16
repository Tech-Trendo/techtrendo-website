"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminReview } from "@/lib/admin-types";

export default function AdminReviewsPage() {
  return (
    <AdminListPage<AdminReview>
      title="Reviews"
      singular="review"
      fetchUrl="/api/admin/reviews"
      createHref="/admin/reviews/new"
      createLabel="New review"
      rowKey={(r) => String(r.id)}
      editUrl={(r) => `/admin/reviews/${r.id}/edit`}
      deleteUrl={(r) => `/api/admin/reviews/${r.id}`}
      deleteConfirmText={(r) => (
        <>
          Review by <span className="font-medium text-foreground">{r.reviewerName}</span> will be
          permanently removed.
        </>
      )}
      columns={[
        {
          header: "Reviewer",
          render: (r) => (
            <Link href={`/admin/reviews/${r.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {r.reviewerName}
            </Link>
          ),
        },
        { header: "Role", render: (r) => <span className="text-muted-foreground">{r.reviewerRole}</span> },
        {
          header: "Review",
          className: "max-w-md",
          render: (r) => <span className="text-muted-foreground line-clamp-1">{r.review}</span>,
        },
      ]}
    />
  );
}
