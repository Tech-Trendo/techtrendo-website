"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import GalleryItemForm from "@/components/admin/forms/GalleryItemForm";
import type { AdminGalleryItem } from "@/lib/admin-types";

export default function AdminGalleryItemEditPage() {
  return (
    <AdminEditPage<AdminGalleryItem>
      fetchUrl={(key) => `/api/admin/gallery-items/${encodeURIComponent(key)}`}
      backHref="/dash/gallery-items"
      backLabel="Back to gallery"
    >
      {(item) => <GalleryItemForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
