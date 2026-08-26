"use client";

import AdminGate from "@/components/admin/AdminGate";
import ProductForm from "@/components/admin/forms/ProductForm";

export default function AdminProductNewPage() {
  return (
    <AdminGate>
      <ProductForm mode="create" />
    </AdminGate>
  );
}
