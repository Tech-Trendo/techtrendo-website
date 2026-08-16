"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";
import type { AdminTestimonial } from "@/lib/admin-types";

export default function AdminTestimonialEditPage() {
  return (
    <AdminEditPage<AdminTestimonial>
      fetchUrl={(key) => `/api/admin/testimonials/${encodeURIComponent(key)}`}
      backHref="/admin/testimonials"
      backLabel="Back to testimonials"
    >
      {(item) => <TestimonialForm mode="edit" item={item} resource="testimonials" label="Testimonial" backHref="/admin/testimonials" />}
    </AdminEditPage>
  );
}
