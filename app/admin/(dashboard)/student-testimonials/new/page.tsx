"use client";

import AdminGate from "@/components/admin/AdminGate";
import TestimonialForm from "@/components/admin/forms/TestimonialForm";

export default function AdminStudentTestimonialNewPage() {
  return (
    <AdminGate>
      <TestimonialForm mode="create" resource="student-testimonials" label="Student Testimonial" backHref="/admin/student-testimonials" />
    </AdminGate>
  );
}
