"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminTestimonial } from "@/lib/admin-types";

export default function AdminStudentTestimonialsPage() {
  return (
    <AdminListPage<AdminTestimonial>
      title="Student Testimonials"
      singular="student testimonial"
      fetchUrl="/api/admin/student-testimonials"
      createHref="/dash/student-testimonials/new"
      createLabel="New testimonial"
      rowKey={(t) => String(t.id)}
      editUrl={(t) => `/dash/student-testimonials/${t.id}/edit`}
      deleteUrl={(t) => `/api/admin/student-testimonials/${t.id}`}
      deleteConfirmText={(t) => (
        <>
          Testimonial by <span className="font-medium text-foreground">{t.author_name}</span> will
          be permanently removed.
        </>
      )}
      columns={[
        {
          header: "Image",
          render: (t) => <Thumb src={t.author_image} alt={t.author_name} />,
        },
        {
          header: "Author",
          render: (t) => (
            <Link href={`/dash/student-testimonials/${t.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {t.author_name}
            </Link>
          ),
        },
        {
          header: "Text",
          className: "max-w-md",
          render: (t) => <span className="text-muted-foreground line-clamp-1">{t.text}</span>,
        },
      ]}
    />
  );
}
