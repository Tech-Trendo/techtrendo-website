"use client";

import AdminGate from "@/components/admin/AdminGate";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";

export default function AdminTestimonialNewPage() {
  return (
    <AdminGate>
      <TestimonialForm mode="create" resource="testimonials" label="Testimonial" backHref="/admin/testimonials" />
    </AdminGate>
  );
}
