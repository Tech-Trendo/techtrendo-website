"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  Loader2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  User,
} from "lucide-react";
import type { AdminBlog, AdminCategory, AdminContactMessage } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const auth = useAdminAuth();

  const [posts, setPosts] = useState<AdminBlog[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [contacts, setContacts] = useState<AdminContactMessage[]>([]);
  const [contactCount, setContactCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [postsRes, contactsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/blogs?page=1&page_size=5", { cache: "no-store" }),
        fetch("/api/admin/contact-messages?page=1&page_size=5", { cache: "no-store" }),
        fetch("/api/admin/blog-categories", { cache: "no-store" }),
      ]);
      if (!postsRes.ok || !contactsRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to load dashboard data");
      }
      const [postsData, contactsData, categoriesData] = await Promise.all([
        postsRes.json(),
        contactsRes.json(),
        categoriesRes.json(),
      ]);
      setPosts((postsData as { results: AdminBlog[] }).results ?? []);
      setPostCount((postsData as { count: number }).count ?? 0);
      setContacts((contactsData as { results: AdminContactMessage[] }).results ?? []);
      setContactCount((contactsData as { count: number }).count ?? 0);
      setCategoryCount(((categoriesData as { results: AdminCategory[] }).results ?? []).length);
    } catch {
      setLoadError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.checked) return;
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [auth.checked, load]);

  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      label: "Blog Posts",
      value: postCount,
      href: "/admin/blogs",
      icon: FileText,
    },
    {
      label: "Contact Messages",
      value: contactCount,
      href: "/admin/contact-messages",
      icon: Mail,
    },
    {
      label: "Categories",
      value: categoryCount,
      href: "/admin/blogs",
      icon: FolderOpen,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your website content.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm mb-6 flex items-center gap-3">
          <span>{loadError}</span>
          <button
            onClick={() => void load()}
            className="ml-auto inline-flex items-center gap-1 text-xs hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-border rounded-lg bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-8 w-10 animate-pulse rounded bg-muted" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className="rounded-md bg-primary/10 p-2.5 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
              View all <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent Posts</h2>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className="mx-auto h-7 w-7 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No blog posts yet.</p>
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Plus className="h-4 w-4" /> New post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((post) => (
                <li key={post.slug} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/blogs/${post.slug}/edit`}
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {post.category?.name ?? "Uncategorized"} · {formatDate(post.pub_date)}
                    </p>
                  </div>
                  {post.is_featured && (
                    <Badge variant="secondary" className="text-[10px]">
                      Featured
                    </Badge>
                  )}
                  <Link
                    href={`/admin/blogs/${post.slug}/edit`}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Edit"
                    aria-label={`Edit ${post.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent Messages</h2>
            <Link
              href="/admin/contact-messages"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Mail className="mx-auto h-7 w-7 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No contact messages yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {contacts.map((msg) => (
                <li key={msg.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <Link
                      href="/admin/contact-messages"
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {msg.first_name} {msg.last_name ?? ""}
                      </span>
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {msg.email} · {formatDate(msg.submitted_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {msg.service}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
