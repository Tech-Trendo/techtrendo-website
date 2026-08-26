"use client";

import { X } from "lucide-react";

interface ViewDetailsModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Simple read-only details dialog used by inbox-style list pages. */
export default function ViewDetailsModal({ title, subtitle, onClose, children }: ViewDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-card border border-border max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4">{children}</div>
      </div>
    </div>
  );
}
