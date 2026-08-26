"use client";

import AdminGate from "@/components/admin/AdminGate";
import CareersForm from "@/components/admin/forms/CareersForm";

export default function NewJobPage() {
  return (
    <AdminGate>
      <CareersForm resource="jobs" label="Job" mode="create" />
    </AdminGate>
  );
}
