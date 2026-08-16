"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import MarketPageForm from "@/components/admin/forms/MarketPageForm";
import type { AdminMarketPage } from "@/lib/admin-types";

export default function AdminMarketEditPage() {
  return (
    <AdminEditPage<AdminMarketPage>
      fetchUrl={(key) => `/api/admin/markets/${encodeURIComponent(key)}`}
      backHref="/admin/markets"
      backLabel="Back to market pages"
    >
      {(item) => <MarketPageForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
