"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import { Badge } from "@/components/ui/badge";
import type { AdminJob } from "@/lib/admin-types";

function formatDate(date: string | null): string {
  if (!date) return "-";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminJobsPage() {
  return (
    <AdminListPage<AdminJob>
      title="Jobs"
      singular="job"
      fetchUrl="/api/admin/jobs"
      createHref="/dash/jobs/new"
      createLabel="New job"
      rowKey={(j) => String(j.id)}
      editUrl={(j) => `/dash/jobs/${j.id}/edit`}
      deleteUrl={(j) => `/api/admin/jobs/${j.id}`}
      deleteConfirmText={(j) => (
        <>
          Job <span className="font-medium text-foreground">{j.title}</span> will be permanently
          removed. This cannot be undone.
        </>
      )}
      emptyText="No jobs posted yet."
      columns={[
        {
          header: "Image",
          render: (j) => <Thumb src={j.img} alt={j.title} />,
        },
        {
          header: "Title",
          render: (j) => (
            <Link href={`/dash/jobs/${j.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {j.title}
            </Link>
          ),
        },
        { header: "Location", render: (j) => <span className="text-muted-foreground">{j.location}</span> },
        { header: "Type", render: (j) => <span className="text-muted-foreground">{j.type}</span> },
        { header: "Deadline", render: (j) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(j.deadline)}</span> },
        {
          header: "Status",
          render: (j) => (
            <Badge
              variant="secondary"
              className={j.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {j.status}
            </Badge>
          ),
        },
      ]}
    />
  );
}
