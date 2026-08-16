"use client";

import AdminGate from "@/components/admin/AdminGate";
import MarketPageForm from "@/components/admin/forms/MarketPageForm";

export default function AdminMarketNewPage() {
  return (
    <AdminGate>
      <MarketPageForm mode="create" />
    </AdminGate>
  );
}
