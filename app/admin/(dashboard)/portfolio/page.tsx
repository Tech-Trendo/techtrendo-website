"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminPortfolio } from "@/lib/admin-types";

const TYPE_LABELS: Record<AdminPortfolio["type"], string> = {
  mobile_app: "Mobile App",
  website: "Website",
  software: "Software",
};

export default function AdminPortfolioPage() {
  return (
    <AdminListPage<AdminPortfolio>
      title="Portfolio"
      singular="portfolio item"
      fetchUrl="/api/admin/portfolio"
      createHref="/admin/portfolio/new"
      createLabel="New item"
      rowKey={(p) => String(p.id)}
      editUrl={(p) => `/admin/portfolio/${p.id}/edit`}
      deleteUrl={(p) => `/api/admin/portfolio/${p.id}`}
      deleteConfirmText={(p) => (
        <>
          <span className="font-medium text-foreground">{p.title}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Image",
          render: (p) => <Thumb src={p.image} alt={p.title} />,
        },
        {
          header: "Title",
          render: (p) => (
            <Link href={`/admin/portfolio/${p.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {p.title}
            </Link>
          ),
        },
        { header: "Type", render: (p) => <span className="text-muted-foreground">{TYPE_LABELS[p.type] ?? p.type}</span> },
      ]}
    />
  );
}
