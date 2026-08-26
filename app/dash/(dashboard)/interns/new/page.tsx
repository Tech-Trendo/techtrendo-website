"use client";

import AdminGate from "@/components/admin/AdminGate";
import CareersForm from "@/components/admin/forms/CareersForm";

export default function NewInternPage() {
  return (
    <AdminGate>
      <CareersForm resource="interns" label="Internship" mode="create" />
    </AdminGate>
  );
}
