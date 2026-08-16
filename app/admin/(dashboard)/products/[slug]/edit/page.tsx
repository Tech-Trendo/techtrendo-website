"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import ProductForm from "@/components/admin/forms/ProductForm";
import type { AdminProduct } from "@/lib/admin-types";

export default function AdminProductEditPage() {
  return (
    <AdminEditPage<AdminProduct>
      fetchUrl={(key) => `/api/admin/products/${encodeURIComponent(key)}`}
      backHref="/admin/products"
      backLabel="Back to products"
    >
      {(item) => <ProductForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
