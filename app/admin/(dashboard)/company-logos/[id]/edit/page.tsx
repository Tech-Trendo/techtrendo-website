"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import CompanyLogoForm from "@/components/admin/forms/CompanyLogoForm";
import type { AdminCompanyLogo } from "@/lib/admin-types";

export default function AdminCompanyLogoEditPage() {
  return (
    <AdminEditPage<AdminCompanyLogo>
      fetchUrl={(key) => `/api/admin/company-logos/${encodeURIComponent(key)}`}
      backHref="/admin/company-logos"
      backLabel="Back to company logos"
    >
      {(item) => <CompanyLogoForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
