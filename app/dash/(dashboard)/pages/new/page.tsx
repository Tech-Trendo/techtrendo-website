"use client";

import AdminGate from "@/components/admin/AdminGate";
import PageForm from "@/components/admin/forms/PageForm";

export default function AdminPageNewPage() {
  return (
    <AdminGate>
      <PageForm mode="create" />
    </AdminGate>
  );
}
