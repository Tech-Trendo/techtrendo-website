"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AdminBlogCategory } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import BlogCategoryForm from "@/components/admin/forms/BlogCategoryForm";

export default function AdminBlogCategoryEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const auth = useAdminAuth();
  const [item, setItem] = useState<AdminBlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !auth.checked) return;
    fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return (await res.json()) as AdminBlogCategory;
      })
      .then(setItem)
      .catch(() => setError("Category not found or could not be loaded."))
      .finally(() => setLoading(false));
  }, [id, auth.checked]);

  if (!auth.checked || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error ?? "Category not found."}</p>
        <Link href="/admin/blog-categories" className="text-sm text-primary hover:underline">
          Back to categories
        </Link>
      </div>
    );
  }

  return <BlogCategoryForm mode="edit" item={item} />;
}
