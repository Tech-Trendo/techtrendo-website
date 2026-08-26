"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import { Badge } from "@/components/ui/badge";
import type { AdminIntern } from "@/lib/admin-types";

function formatDate(date: string | null): string {
  if (!date) return "-";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminInternsPage() {
  return (
    <AdminListPage<AdminIntern>
      title="Internships"
      singular="internship"
      fetchUrl="/api/admin/interns"
      createHref="/dash/interns/new"
      createLabel="New internship"
      rowKey={(i) => String(i.id)}
      editUrl={(i) => `/dash/interns/${i.id}/edit`}
      deleteUrl={(i) => `/api/admin/interns/${i.id}`}
      deleteConfirmText={(i) => (
        <>
          Internship <span className="font-medium text-foreground">{i.title}</span> will be
          permanently removed. This cannot be undone.
        </>
      )}
      emptyText="No internships posted yet."
      columns={[
        {
          header: "Image",
          render: (i) => <Thumb src={i.img} alt={i.title} />,
        },
        {
          header: "Title",
          render: (i) => (
            <Link href={`/dash/interns/${i.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {i.title}
            </Link>
          ),
        },
        { header: "Location", render: (i) => <span className="text-muted-foreground">{i.location}</span> },
        { header: "Duration", render: (i) => <span className="text-muted-foreground">{i.duration ?? "-"}</span> },
        { header: "Deadline", render: (i) => <span className="text-muted-foreground whitespace-nowrap">{formatDate(i.deadline)}</span> },
        {
          header: "Status",
          render: (i) => (
            <Badge
              variant="secondary"
              className={i.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {i.status}
            </Badge>
          ),
        },
      ]}
    />
  );
}
