"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminProduct } from "@/lib/admin-types";

export default function AdminProductsPage() {
  return (
    <AdminListPage<AdminProduct>
      title="Products"
      singular="product"
      fetchUrl="/api/admin/products"
      createHref="/admin/products/new"
      createLabel="New product"
      rowKey={(p) => p.slug}
      editUrl={(p) => `/admin/products/${p.slug}/edit`}
      deleteUrl={(p) => `/api/admin/products/${p.slug}`}
      deleteConfirmText={(p) => (
        <>
          <span className="font-medium text-foreground">{p.title}</span> and its public
          product page will be removed. This cannot be undone.
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
            <Link href={`/admin/products/${p.slug}/edit`} className="font-medium text-foreground hover:text-primary">
              {p.title}
            </Link>
          ),
        },
        { header: "Category", render: (p) => <span className="text-muted-foreground">{p.category}</span> },
      ]}
    />
  );
}
