"use client";

import AdminGate from "@/components/admin/AdminGate";
import GalleryItemForm from "@/components/admin/forms/GalleryItemForm";

export default function AdminGalleryItemNewPage() {
  return (
    <AdminGate>
      <GalleryItemForm mode="create" />
    </AdminGate>
  );
}
