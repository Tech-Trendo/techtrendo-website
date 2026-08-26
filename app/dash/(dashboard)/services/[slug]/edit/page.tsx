"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import ServiceForm from "@/components/admin/forms/ServiceForm";
import type { AdminService } from "@/lib/admin-types";

export default function AdminServiceEditPage() {
  return (
    <AdminEditPage<AdminService>
      fetchUrl={(key) => `/api/admin/services/${encodeURIComponent(key)}`}
      backHref="/dash/services"
      backLabel="Back to services"
    >
      {(item) => <ServiceForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
