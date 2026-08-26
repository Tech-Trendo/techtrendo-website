"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import { Badge } from "@/components/ui/badge";
import type { AdminMarketPage } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminMarketsPage() {
  return (
    <AdminListPage<AdminMarketPage>
      title="Market Pages"
      singular="market page"
      fetchUrl="/api/admin/markets"
      createHref="/dash/markets/new"
      createLabel="New market page"
      rowKey={(m) => m.slug}
      editUrl={(m) => `/dash/markets/${m.slug}/edit`}
      deleteUrl={(m) => `/api/admin/markets/${m.slug}`}
      deleteConfirmText={(m) => (
        <>
          <span className="font-medium text-foreground">{m.country_name}</span> and its public
          market page will be removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Country",
          render: (m) => (
            <Link href={`/dash/markets/${m.slug}/edit`} className="font-medium text-foreground hover:text-primary">
              {m.country_name}
            </Link>
          ),
        },
        { header: "Slug", render: (m) => <span className="text-muted-foreground">/{m.slug}</span> },
        {
          header: "Status",
          render: (m) =>
            m.status === "published" ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            ),
        },
        { header: "Updated", render: (m) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(m.updated_at)}</span> },
      ]}
    />
  );
}
