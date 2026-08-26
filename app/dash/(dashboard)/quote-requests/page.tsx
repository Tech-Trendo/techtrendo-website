"use client";

import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminQuoteRequest } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminQuoteRequestsPage() {
  return (
    <AdminListPage<AdminQuoteRequest>
      title="Quote Requests"
      singular="quote request"
      fetchUrl="/api/admin/quote-requests"
      pageSize={10}
      rowKey={(q) => String(q.id)}
      deleteUrl={(q) => `/api/admin/quote-requests/${q.id}`}
      deleteConfirmText={(q) => (
        <>
          Quote request from <span className="font-medium text-foreground">{q.full_name}</span>{" "}
          will be permanently removed. This cannot be undone.
        </>
      )}
      emptyText="No quote requests yet."
      columns={[
        {
          header: "From",
          render: (q) => (
            <div>
              <p className="font-medium text-foreground">{q.full_name}</p>
              <a href={`mailto:${q.email}`} className="text-xs text-muted-foreground hover:text-primary">
                {q.email}
              </a>
              {q.company && <p className="text-xs text-muted-foreground">{q.company}</p>}
            </div>
          ),
        },
        {
          header: "For",
          render: (q) => (
            <span className="text-muted-foreground">
              {q.service_title ?? q.product_title ?? "-"}
            </span>
          ),
        },
        {
          header: "Message",
          render: (q) => (
            <span className="text-muted-foreground max-w-xs truncate block" title={q.message}>
              {q.message || "-"}
            </span>
          ),
        },
        {
          header: "Submitted",
          render: (q) => (
            <span className="text-muted-foreground whitespace-nowrap">{formatDate(q.submitted_at)}</span>
          ),
        },
      ]}
    />
  );
}
