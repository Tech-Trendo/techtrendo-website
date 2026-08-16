"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import PageForm from "@/components/admin/forms/PageForm";
import type { AdminPage } from "@/lib/admin-types";

export default function AdminPageEditPage() {
  return (
    <AdminEditPage<AdminPage>
      fetchUrl={(key) => `/api/admin/pages/${encodeURIComponent(key)}`}
      backHref="/admin/pages"
      backLabel="Back to pages"
    >
      {(item) => <PageForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
