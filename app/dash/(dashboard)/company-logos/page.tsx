"use client";

import Link from "next/link";
import AdminListPage from "@/components/admin/AdminListPage";
import Thumb from "@/components/admin/Thumb";
import type { AdminCompanyLogo } from "@/lib/admin-types";

export default function AdminCompanyLogosPage() {
  return (
    <AdminListPage<AdminCompanyLogo>
      title="Company Logos"
      singular="logo"
      fetchUrl="/api/admin/company-logos"
      createHref="/dash/company-logos/new"
      createLabel="New logo"
      rowKey={(l) => String(l.id)}
      editUrl={(l) => `/dash/company-logos/${l.id}/edit`}
      deleteUrl={(l) => `/api/admin/company-logos/${l.id}`}
      deleteConfirmText={(l) => (
        <>
          Logo <span className="font-medium text-foreground">{l.name}</span> will be permanently
          removed.
        </>
      )}
      columns={[
        {
          header: "Logo",
          render: (l) => <Thumb src={l.image} alt={l.name} />,
        },
        {
          header: "Name",
          render: (l) => (
            <Link href={`/dash/company-logos/${l.id}/edit`} className="font-medium text-foreground hover:text-primary">
              {l.name}
            </Link>
          ),
        },
      ]}
    />
  );
}
