"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Inbox, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { PaginatedResponse } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";

export interface AdminColumn<T> {
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface AdminListPageProps<T> {
  title: string;
  singular?: string;
  fetchUrl: string;
  createHref?: string;
  createLabel?: string;
  columns: AdminColumn<T>[];
  rowKey: (row: T) => string;
  editUrl?: (row: T) => string;
  deleteUrl?: (row: T) => string;
  deleteConfirmText?: (row: T) => React.ReactNode;
  emptyText?: string;
  pageSize?: number;
}

export default function AdminListPage<T>({
  title,
  singular = "item",
  fetchUrl,
  createHref,
  createLabel = "New",
  columns,
  rowKey,
  editUrl,
  deleteUrl,
  deleteConfirmText,
  emptyText,
  pageSize = 10,
}: AdminListPageProps<T>) {
  const auth = useAdminAuth();

  const [rows, setRows] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [paginated, setPaginated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
      const res = await fetch(`${fetchUrl}?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as PaginatedResponse<T> | T[];
      if (Array.isArray(data)) {
        // Unpaginated endpoints return a plain array with all rows.
        setRows(data);
        setCount(data.length);
        setPaginated(false);
      } else {
        setRows(data.results ?? []);
        setCount(data.count ?? 0);
        setPaginated(true);
      }
    } catch {
      setLoadError(`Could not load ${singular}s.`);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, page, pageSize, singular]);

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

  const confirmDelete = async () => {
    if (!deleting || !deleteUrl) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(deleteUrl(deleting), { method: "DELETE", cache: "no-store" });
      if (res.ok) {
        toast.success(`${singular.charAt(0).toUpperCase() + singular.slice(1)} deleted.`);
        setCount((c) => Math.max(0, c - 1));
        await fetchList();
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

  const totalPages = paginated ? Math.max(1, Math.ceil(count / pageSize)) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{count} total</p>
        </div>
        {createHref && (
          <Link
            href={createHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> {createLabel}
          </Link>
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
        ) : rows.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{emptyText ?? `No ${singular}s yet.`}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                {columns.map((col) => (
                  <th key={col.header} className={`px-4 py-3 font-medium ${col.className ?? ""}`}>
                    {col.header}
                  </th>
                ))}
                {(editUrl || deleteUrl) && (
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-muted/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                  {(editUrl || deleteUrl) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {editUrl && (
                          <Link
                            href={editUrl(row)}
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        )}
                        {deleteUrl && (
                          <button
                            onClick={() => setDeleting(row)}
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {count > 0 && (
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
            <h2 className="text-lg font-semibold">Delete {singular}?</h2>
            <p className="text-sm text-muted-foreground">
              {deleteConfirmText ? deleteConfirmText(deleting) : `This ${singular} will be permanently removed. This cannot be undone.`}
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
