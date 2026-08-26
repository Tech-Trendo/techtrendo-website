"use client";

import { useState } from "react";
import AdminListPage from "@/components/admin/AdminListPage";
import ViewDetailsModal from "@/components/admin/ViewDetailsModal";
import { Eye } from "lucide-react";
import type { AdminQuoteRequest } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

export default function AdminQuoteRequestsPage() {
  const [viewing, setViewing] = useState<AdminQuoteRequest | null>(null);

  return (
    <>
      <AdminListPage<AdminQuoteRequest>
        title="Quote Requests"
        singular="quote request"
        fetchUrl="/api/admin/quote-requests"
        pageSize={10}
        rowKey={(q) => String(q.id)}
        actions={(q) => (
          <button
            onClick={() => setViewing(q)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            title="View"
            aria-label={`View quote request from ${q.full_name}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
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
              <button
                onClick={() => setViewing(q)}
                className="text-left font-medium text-foreground hover:text-primary"
              >
                {q.full_name}
              </button>
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

      {viewing && (
        <ViewDetailsModal
          title={`Quote request from ${viewing.full_name}`}
          subtitle={formatDate(viewing.submitted_at)}
          onClose={() => setViewing(null)}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Detail label="Name">{viewing.full_name}</Detail>
            <Detail label="Email">
              <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">
                {viewing.email}
              </a>
            </Detail>
            <Detail label="Phone">{viewing.phone ?? "-"}</Detail>
            <Detail label="Company">{viewing.company ?? "-"}</Detail>
            <Detail label="Interested in">
              {viewing.service_title ?? viewing.product_title ?? "-"}
            </Detail>
          </div>
          <Detail label="Message">
            {viewing.message ? (
              <p className="whitespace-pre-wrap border border-border rounded-md bg-muted/30 p-3">
                {viewing.message}
              </p>
            ) : (
              "-"
            )}
          </Detail>
        </ViewDetailsModal>
      )}
    </>
  );
}
