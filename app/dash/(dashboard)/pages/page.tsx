"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminPage } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminPagesPage() {
  return (
    <AdminListPage<AdminPage>
      title="Pages"
      singular="page"
      fetchUrl="/api/admin/pages"
      createHref="/dash/pages/new"
      createLabel="New page"
      rowKey={(p) => String(p.id)}
      editUrl={(p) => `/dash/pages/${p.id}/edit`}
      deleteUrl={(p) => `/api/admin/pages/${p.id}`}
      deleteConfirmText={(p) => (
        <>
          <span className="font-medium text-foreground">{p.title}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Title",
          render: (p) => (
            <Link href={`/dash/pages/${p.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {p.title}
            </Link>
          ),
        },
        { header: "Slug", render: (p) => <span className="text-muted-foreground">/{p.slug}</span> },
        { header: "Updated", render: (p) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(p.updated_at)}</span> },
      ]}
    />
  );
}
