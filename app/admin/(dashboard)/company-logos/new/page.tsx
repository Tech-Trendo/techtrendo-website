"use client";

import AdminGate from "@/components/admin/AdminGate";
import CompanyLogoForm from "@/components/admin/forms/CompanyLogoForm";

export default function AdminCompanyLogoNewPage() {
  return (
    <AdminGate>
      <CompanyLogoForm mode="create" />
    </AdminGate>
  );
}
