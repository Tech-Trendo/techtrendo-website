"use client";

import AdminGate from "@/components/admin/AdminGate";
import ServiceForm from "@/components/admin/forms/ServiceForm";

export default function AdminServiceNewPage() {
  return (
    <AdminGate>
      <ServiceForm mode="create" />
    </AdminGate>
  );
}
