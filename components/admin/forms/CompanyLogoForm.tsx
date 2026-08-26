"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminCompanyLogo } from "@/lib/admin-types";
import { apiErrorText, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import ImageField, { resolveImageUrl } from "@/components/admin/ImageField";

interface CompanyLogoFormProps {
  mode: "create" | "edit";
  item?: AdminCompanyLogo | null;
}

export default function CompanyLogoForm({ mode, item }: CompanyLogoFormProps) {
  const router = useRouter();
  const [name, setName] = useState(item?.name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const url = mode === "edit" && item ? `/api/admin/company-logos/${item.id}` : "/api/admin/company-logos";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", { name: name.trim() }, { image });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Logo updated." : "Logo created.");
      router.push("/dash/company-logos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Company Logo" : "New Company Logo"}
      backHref="/dash/company-logos"
      submitLabel={mode === "edit" ? "Save changes" : "Create logo"}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-destructive">*</span>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClassName()} />
        </div>
        <ImageField label="Logo image" existingUrl={resolveImageUrl(item?.image ?? null)} file={image} onChange={setImage} alt={name} />
      </section>
    </AdminForm>
  );
}
