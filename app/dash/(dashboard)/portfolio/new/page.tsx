"use client";

import AdminGate from "@/components/admin/AdminGate";
import PortfolioForm from "@/components/admin/forms/PortfolioForm";

export default function AdminPortfolioNewPage() {
  return (
    <AdminGate>
      <PortfolioForm mode="create" />
    </AdminGate>
  );
}
