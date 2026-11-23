"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Inbox, Loader2, Mail, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { AdminMailSubscriber } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { apiErrorText } from "@/lib/admin-submit";

const PAGE_SIZE = 20;

async function loadSubscribers(): Promise<AdminMailSubscriber[]> {
  const res = await fetch(`/api/admin/mail-subscribers?page_size=${PAGE_SIZE}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("failed");
  const data = (await res.json()) as
    | { results?: AdminMailSubscriber[] }
    | AdminMailSubscriber[];
  return Array.isArray(data) ? data : data.results ?? [];
}

export default function AdminMailSubscribersPage() {
  const auth = useAdminAuth();

  const [rows, setRows] = useState<AdminMailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draftEmail, setDraftEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<AdminMailSubscriber | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      setRows(await loadSubscribers());
    } catch {
      setLoadError("Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.checked) return;
    let cancelled = false;
    loadSubscribers()
      .then((nextRows) => {
        if (!cancelled) setRows(nextRows);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load subscribers.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [auth.checked]);

  const addSubscriber = async () => {
    const email = draftEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/mail-subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });
      if (res.ok) {
        toast.success("Subscriber added.");
        setDraftEmail("");
        await fetchList();
      } else {
        toast.error((await apiErrorText(res)) ?? "Could not add subscriber.");
      }
    } catch {
      toast.error("Could not add subscriber.");
    } finally {
      setAdding(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/admin/mail-subscribers/${deleting.id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (res.ok) {
        toast.success("Subscriber removed.");
        setRows((prev) => prev.filter((r) => r.id !== deleting.id));
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Mail Subscribers</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={draftEmail}
          onChange={(e) => setDraftEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !adding && void addSubscriber()}
          placeholder="name@example.com"
          type="email"
          className="w-full sm:w-80 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => void addSubscriber()}
          disabled={adding}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add subscriber
        </button>
      </div>

      {loadError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm mb-4 flex items-center gap-3">
          <span>{loadError}</span>
          <button onClick={() => void fetchList()} className="ml-auto inline-flex items-center gap-1 text-xs hover:underline">
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
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${row.email}`} className="text-foreground hover:text-primary">
                        {row.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setDeleting(row)}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                        aria-label={`Delete ${row.email}`}
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

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-card border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Remove subscriber?</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleting.email}</span> will no longer
              receive emails. This cannot be undone.
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
