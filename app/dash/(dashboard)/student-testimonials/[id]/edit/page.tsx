"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";
import type { AdminTestimonial } from "@/lib/admin-types";

export default function AdminStudentTestimonialEditPage() {
  return (
    <AdminEditPage<AdminTestimonial>
      fetchUrl={(key) => `/api/admin/student-testimonials/${encodeURIComponent(key)}`}
      backHref="/dash/student-testimonials"
      backLabel="Back to student testimonials"
    >
      {(item) => <TestimonialForm mode="edit" item={item} resource="student-testimonials" label="Student Testimonial" backHref="/dash/student-testimonials" />}
    </AdminEditPage>
  );
}
