"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import CareersForm from "@/components/admin/forms/CareersForm";
import type { AdminJob } from "@/lib/admin-types";

export default function EditJobPage() {
  return (
    <AdminEditPage<AdminJob>
      fetchUrl={(key) => `/api/admin/jobs/${encodeURIComponent(key)}`}
      backHref="/dash/jobs"
      backLabel="Back to jobs"
    >
      {(item) => <CareersForm resource="jobs" label="Job" mode="edit" item={item} />}
    </AdminEditPage>
  );
}
