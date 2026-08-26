"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminEvent } from "@/lib/admin-types";

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminEventsPage() {
  return (
    <AdminListPage<AdminEvent>
      title="Events"
      singular="event"
      fetchUrl="/api/admin/events"
      createHref="/dash/events/new"
      createLabel="New event"
      rowKey={(e) => String(e.id)}
      editUrl={(e) => `/dash/events/${e.id}/edit`}
      deleteUrl={(e) => `/api/admin/events/${e.id}`}
      deleteConfirmText={(e) => (
        <>
          <span className="font-medium text-foreground">{e.title}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      columns={[
        {
          header: "Image",
          render: (e) => <Thumb src={e.image} alt={e.title} />,
        },
        {
          header: "Title",
          render: (e) => (
            <Link href={`/dash/events/${e.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {e.title}
            </Link>
          ),
        },
        { header: "Location", render: (e) => <span className="text-muted-foreground">{e.location}</span> },
        { header: "Date", render: (e) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(e.date)}</span> },
      ]}
    />
  );
}
