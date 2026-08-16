"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import PortfolioForm from "@/components/admin/forms/PortfolioForm";
import type { AdminPortfolio } from "@/lib/admin-types";

export default function AdminPortfolioEditPage() {
  return (
    <AdminEditPage<AdminPortfolio>
      fetchUrl={(key) => `/api/admin/portfolio/${encodeURIComponent(key)}`}
      backHref="/admin/portfolio"
      backLabel="Back to portfolio"
    >
      {(item) => <PortfolioForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
