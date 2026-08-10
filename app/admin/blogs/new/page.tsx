"use client";

import { useEffect, useState } from "react";
import type { AdminCategory } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import BlogForm from "@/components/admin/BlogForm";

export default function AdminBlogNewPage() {
  const auth = useAdminAuth();
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    if (!auth.checked) return;
    fetch("/api/admin/blog-categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { results?: AdminCategory[] }) => setCategories(data.results ?? []))
      .catch(() => undefined);
  }, [auth.checked]);

  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return <BlogForm mode="create" blog={null} categories={categories} />;
}