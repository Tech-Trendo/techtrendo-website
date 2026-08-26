"use client";

import AdminListPage from "@/components/admin/AdminListPage";
import { resolveImageUrl } from "@/components/admin/ImageField";
import { FileText, Phone } from "lucide-react";

interface ApplicationRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string | null;
  resume: string | null;
}

function fileLink(url: string | null, label: string): React.ReactNode {
  const href = resolveImageUrl(url);
  if (!href) return <span className="text-muted-foreground">-</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      <FileText className="h-3.5 w-3.5" /> {label}
    </a>
  );
}

export default function AdminInternApplicationsPage() {
  return (
    <AdminListPage<ApplicationRow>
      title="Intern Applications"
      singular="application"
      fetchUrl="/api/admin/intern-applications"
      pageSize={10}
      rowKey={(a) => String(a.id)}
      deleteUrl={(a) => `/api/admin/intern-applications/${a.id}`}
      deleteConfirmText={(a) => (
        <>
          Application from <span className="font-medium text-foreground">{a.full_name}</span> will
          be permanently removed. This cannot be undone.
        </>
      )}
      emptyText="No intern applications yet."
      columns={[
        {
          header: "Applicant",
          render: (a) => (
            <div>
              <p className="font-medium text-foreground">{a.full_name}</p>
              <a href={`mailto:${a.email}`} className="text-xs text-muted-foreground hover:text-primary">
                {a.email}
              </a>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> {a.phone}
              </p>
            </div>
          ),
        },
        {
          header: "Resume",
          render: (a) => fileLink(a.resume, "Download"),
        },
        {
          header: "Cover Letter",
          render: (a) => fileLink(a.cover_letter, "Open"),
        },
      ]}
    />
  );
}
