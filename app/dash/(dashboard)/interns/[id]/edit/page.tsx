"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import CareersForm from "@/components/admin/forms/CareersForm";
import type { AdminIntern } from "@/lib/admin-types";

export default function EditInternPage() {
  return (
    <AdminEditPage<AdminIntern>
      fetchUrl={(key) => `/api/admin/interns/${encodeURIComponent(key)}`}
      backHref="/dash/interns"
      backLabel="Back to internships"
    >
      {(item) => <CareersForm resource="interns" label="Internship" mode="edit" item={item} />}
    </AdminEditPage>
  );
}
