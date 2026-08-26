"use client";

import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminSuggestTopic } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminSuggestedTopicsPage() {
  return (
    <AdminListPage<AdminSuggestTopic>
      title="Suggested Topics"
      singular="topic"
      fetchUrl="/api/admin/suggested-topics"
      pageSize={10}
      rowKey={(t) => String(t.id)}
      deleteUrl={(t) => `/api/admin/suggested-topics/${t.id}`}
      deleteConfirmText={(t) => (
        <>
          Topic suggestion from{" "}
          <span className="font-medium text-foreground">{t.full_name}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      emptyText="No topic suggestions yet."
      columns={[
        {
          header: "From",
          render: (t) => (
            <div>
              <p className="font-medium text-foreground">{t.full_name}</p>
              <a href={`mailto:${t.email}`} className="text-xs text-muted-foreground hover:text-primary">
                {t.email}
              </a>
              {t.phone && <p className="text-xs text-muted-foreground">{t.phone}</p>}
            </div>
          ),
        },
        {
          header: "Topic",
          render: (t) => <span className="text-muted-foreground">{t.topic ?? "-"}</span>,
        },
        {
          header: "Submitted",
          render: (t) => (
            <span className="text-muted-foreground whitespace-nowrap">{formatDate(t.submitted_at)}</span>
          ),
        },
      ]}
    />
  );
}
