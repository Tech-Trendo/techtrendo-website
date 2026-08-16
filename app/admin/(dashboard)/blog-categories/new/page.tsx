"use client";

import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Loader2 } from "lucide-react";
import BlogCategoryForm from "@/components/admin/forms/BlogCategoryForm";

export default function AdminBlogCategoryNewPage() {
  const auth = useAdminAuth();
  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  return <BlogCategoryForm mode="create" />;
}
