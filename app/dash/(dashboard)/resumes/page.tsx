"use client";

import AdminListPage from "@/components/admin/AdminListPage";
import { resolveImageUrl } from "@/components/admin/ImageField";
import { FileText, Phone } from "lucide-react";
import type { AdminResume } from "@/lib/admin-types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminResumesPage() {
  return (
    <AdminListPage<AdminResume>
      title="Resumes"
      singular="resume"
      fetchUrl="/api/admin/resumes"
      pageSize={10}
      rowKey={(r) => String(r.id)}
      deleteUrl={(r) => `/api/admin/resumes/${r.id}`}
      deleteConfirmText={(r) => (
        <>
          Resume from <span className="font-medium text-foreground">{r.full_name}</span> will be
          permanently removed. This cannot be undone.
        </>
      )}
      emptyText="No resumes submitted yet."
      columns={[
        {
          header: "Candidate",
          render: (r) => (
            <div>
              <p className="font-medium text-foreground">{r.full_name}</p>
              <a href={`mailto:${r.email}`} className="text-xs text-muted-foreground hover:text-primary">
                {r.email}
              </a>
              {r.phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {r.phone}
                </p>
              )}
            </div>
          ),
        },
        {
          header: "Designation",
          render: (r) => <span className="text-muted-foreground">{r.designation ?? "-"}</span>,
        },
        {
          header: "File",
          render: (r) => {
            const href = resolveImageUrl(r.resume);
            return href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <FileText className="h-3.5 w-3.5" /> Download
              </a>
            ) : (
              <span className="text-muted-foreground">-</span>
            );
          },
        },
        {
          header: "Submitted",
          render: (r) => (
            <span className="text-muted-foreground whitespace-nowrap">{formatDate(r.submitted_at)}</span>
          ),
        },
      ]}
    />
  );
}
