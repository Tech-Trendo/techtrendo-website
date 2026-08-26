"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import type { AdminContactMessage, ContactMessageListResponse } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

const SERVICE_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-100 text-blue-800",
  "Mobile App Development": "bg-green-100 text-green-800",
  "Digital Marketing": "bg-purple-100 text-purple-800",
  "Graphic Design": "bg-pink-100 text-pink-800",
  "Software Development": "bg-indigo-100 text-indigo-800",
  "ICT Services": "bg-orange-100 text-orange-800",
  "Other": "bg-gray-100 text-gray-800",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContactMessagesPage() {
  const auth = useAdminAuth();

  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminContactMessage | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [draftSearch, setDraftSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchList = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search) params.set("search", search);
      if (service) params.set("service", service);
      const res = await fetch(`/api/admin/contact-messages?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load messages");
      const data = (await res.json()) as ContactMessageListResponse;
      setMessages(data.results);
      setCount(data.count);
    } catch {
      setLoadError("Could not load contact messages.");
    } finally {
      setLoading(false);
    }
  }, [page, search, service]);

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
      const res = await fetch(`/api/admin/contact-messages?id=${deleting.id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (res.ok) {
        toast.success("Message deleted.");
        setMessages((rows) => rows.filter((m) => m.id !== deleting.id));
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
  const services = [
    "Web Development",
    "Mobile App Development",
    "Digital Marketing",
    "Graphic Design",
    "Software Development",
    "ICT Services",
    "Other",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Contact Messages</h1>
          <p className="text-sm text-muted-foreground">{count} total</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by name, email, message..."
            className="w-full pl-9 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {!loading && messages.length > 0 && (
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
        ) : messages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {search || service
                ? "No messages match your filters."
                : "No contact messages yet."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {msg.first_name} {msg.last_name ?? ""}
                        </p>
                        {msg.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {msg.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a href={`mailto:${msg.email}`} className="hover:underline">
                      {msg.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={SERVICE_COLORS[msg.service] ?? "bg-gray-100 text-gray-800"}
                    >
                      {msg.service}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={msg.message}>
                    {msg.message}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(msg.submitted_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDeleting(msg)}
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                        aria-label={`Delete message from ${msg.first_name}`}
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
            <h2 className="text-lg font-semibold">Delete contact message?</h2>
            <p className="text-sm text-muted-foreground">
              Message from <span className="font-medium text-foreground">{deleting.first_name} {deleting.last_name ?? ""}</span>
              will be permanently removed. This cannot be undone.
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