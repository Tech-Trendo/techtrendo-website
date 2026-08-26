"use client";

import AdminEditPage from "@/components/admin/AdminEditPage";
import EventForm from "@/components/admin/forms/EventForm";
import type { AdminEvent } from "@/lib/admin-types";

export default function AdminEventEditPage() {
  return (
    <AdminEditPage<AdminEvent>
      fetchUrl={(key) => `/api/admin/events/${encodeURIComponent(key)}`}
      backHref="/dash/events"
      backLabel="Back to events"
    >
      {(item) => <EventForm mode="edit" item={item} />}
    </AdminEditPage>
  );
}
