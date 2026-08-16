"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminGalleryItem } from "@/lib/admin-types";

export default function AdminGalleryItemsPage() {
  return (
    <AdminListPage<AdminGalleryItem>
      title="Gallery"
      singular="gallery item"
      fetchUrl="/api/admin/gallery-items"
      createHref="/admin/gallery-items/new"
      createLabel="New item"
      rowKey={(g) => String(g.id)}
      editUrl={(g) => `/admin/gallery-items/${g.id}/edit`}
      deleteUrl={(g) => `/api/admin/gallery-items/${g.id}`}
      deleteConfirmText={(g) => (
        <>
          <span className="font-medium text-foreground">{g.title}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Image",
          render: (g) => <Thumb src={g.image} alt={g.title} />,
        },
        {
          header: "Title",
          render: (g) => (
            <Link href={`/admin/gallery-items/${g.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {g.title}
            </Link>
          ),
        },
        { header: "Size", render: (g) => <span className="text-muted-foreground capitalize">{g.size}</span> },
      ]}
    />
  );
}
