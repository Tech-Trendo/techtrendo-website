"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminService } from "@/lib/admin-types";

export default function AdminServicesPage() {
  return (
    <AdminListPage<AdminService>
      title="Services"
      singular="service"
      fetchUrl="/api/admin/services"
      createHref="/dash/services/new"
      createLabel="New service"
      rowKey={(s) => s.slug}
      editUrl={(s) => `/dash/services/${s.slug}/edit`}
      deleteUrl={(s) => `/api/admin/services/${s.slug}`}
      deleteConfirmText={(s) => (
        <>
          <span className="font-medium text-foreground">{s.title}</span> and its public
          service page will be removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Title",
          render: (s) => (
            <Link href={`/dash/services/${s.slug}/edit`} className="font-medium text-foreground hover:text-primary">
              {s.title}
            </Link>
          ),
        },
        {
          header: "Short description",
          className: "max-w-md",
          render: (s) => (
            <span className="text-muted-foreground line-clamp-1">{s.short_description || "—"}</span>
          ),
        },
        { header: "Icon", render: (s) => <span className="text-muted-foreground">{s.icon || "—"}</span> },
      ]}
    />
  );
}
