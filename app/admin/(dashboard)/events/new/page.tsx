"use client";

import AdminGate from "@/components/admin/AdminGate";
import EventForm from "@/components/admin/forms/EventForm";

export default function AdminEventNewPage() {
  return (
    <AdminGate>
      <EventForm mode="create" />
    </AdminGate>
  );
}
