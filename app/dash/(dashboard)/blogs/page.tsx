"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  FileText,
} from "lucide-react";
import type { AdminBlog, AdminCategory } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlogsPage() {
  const auth = useAdminAuth();

  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminBlog | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [draftSearch, setDraftSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/admin/blog-categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { results?: AdminCategory[] }) => setCategories(data.results ?? []))
      .catch(() => undefined);
  }, []);

  const fetchList = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/admin/blogs?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load posts");
      const data = (await res.json()) as {
        count: number;
        next: string | null;
        previous: string | null;
        results: AdminBlog[];
      };
      setBlogs(data.results);
      setCount(data.count);
    } catch {
      setLoadError("Could not load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    await fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!auth.checked) return;
    const timer = setTimeout(() => void fetchList(), 0);
    return () => clearTimeout(timer);
  }, [fetchList, auth.checked]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(draftSearch.trim()), 350);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [draftSearch]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/admin/blogs/${deleting.slug}/`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (res.ok) {
        toast.success("Post deleted.");
        setBlogs((rows) => rows.filter((b) => b.slug !== deleting.slug));
        setCount((c) => c - 1);
      } else {
        toast.error("Delete failed.");
      }
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleteBusy(false);
      setDeleting(null);
    }
  };

  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">{count} total</p>
        </div>
        <Link
          href="/dash/blogs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {!loading && blogs.length > 0 && (
          <span className="text-sm text-muted-foreground">{count} result{count === 1 ? "" : "s"}</span>
        )}
      </div>

      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm mb-4 flex items-center gap-3">
          <span>{loadError}</span>
          <button onClick={() => void loadList()} className="ml-auto inline-flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {search || category
                ? "No posts match your filters."
                : "No blog posts yet. Create your first one."}
            </p>
            <Link
              href="/dash/blogs/new"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Plus className="h-4 w-4" /> New post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map((blog) => (
                <tr key={blog.slug} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dash/blogs/${blog.slug}/edit`} className="font-medium text-foreground hover:text-primary">
                      {blog.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">/{blog.slug}</span>
                      {blog.is_featured && (
                        <Badge variant="secondary" className="text-[10px]">
                          Featured
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{blog.read_time} min read</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {blog.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(blog.pub_date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dash/blogs/${blog.slug}/edit`}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Edit"
                        aria-label={`Edit ${blog.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleting(blog)}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {count > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 rounded-md border border-input disabled:opacity-50 hover:bg-muted"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-1.5 rounded-md border border-input disabled:opacity-50 hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-card border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Delete blog post?</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleting.title}</span> will be
              permanently removed and the public page revalidated. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleting(null)}
                disabled={deleteBusy}
                className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void confirmDelete()}
                disabled={deleteBusy}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-destructive text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleteBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}