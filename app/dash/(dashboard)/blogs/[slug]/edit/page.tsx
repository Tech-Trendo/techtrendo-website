"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AdminBlog, AdminCategory } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import BlogForm from "@/components/admin/BlogForm";

export default function AdminBlogEditPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const auth = useAdminAuth();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.checked) return;
    fetch("/api/admin/blog-categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { results?: AdminCategory[] }) => setCategories(data.results ?? []))
      .catch(() => undefined);
  }, [auth.checked]);

  useEffect(() => {
    if (!slug || !auth.checked) return;
    fetch(`/api/admin/blogs/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return (await res.json()) as AdminBlog;
      })
      .then(setBlog)
      .catch(() => setError("Blog post not found or could not be loaded."))
      .finally(() => setLoading(false));
  }, [slug, auth.checked]);

  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error ?? "Post not found."}</p>
        <Link href="/dash/blogs" className="text-sm text-primary hover:underline">
          Back to blog list
        </Link>
      </div>
    );
  }

  return <BlogForm mode="edit" blog={blog} categories={categories} />;
}