"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import type { AdminBlogCategory } from "@/lib/admin-types";

export default function AdminBlogCategoriesPage() {
  return (
    <AdminListPage<AdminBlogCategory>
      title="Blog Categories"
      singular="category"
      fetchUrl="/api/admin/blog-categories"
      createHref="/dash/blog-categories/new"
      createLabel="New category"
      rowKey={(c) => String(c.id)}
      editUrl={(c) => `/dash/blog-categories/${c.id}/edit`}
      deleteUrl={(c) => `/api/admin/blog-categories/${c.id}`}
      columns={[
        {
          header: "Name",
          render: (c) => (
            <Link href={`/dash/blog-categories/${c.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {c.name}
            </Link>
          ),
        },
        { header: "Slug", render: (c) => <span className="text-muted-foreground">/{c.slug}</span> },
      ]}
    />
  );
}
