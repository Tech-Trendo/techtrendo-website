"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminFormProps {
  title: string;
  backHref: string;
  submitLabel: string;
  submitting: boolean;
  onSubmit: () => void;
  error?: string | null;
  children: React.ReactNode;
}

export function inputClassName(hasError?: boolean): string {
  return cn(
    "w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    hasError ? "border-destructive" : "border-input",
  );
}

export function FieldError({ message }: { message: string }) {
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function AdminForm({
  title,
  backHref,
  submitLabel,
  submitting,
  onSubmit,
  error,
  children,
}: AdminFormProps) {
  const router = useRouter();

  return (
    <form
      className="pb-20"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="p-2 rounded-md border border-border text-foreground hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive px-4 py-2 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-5">{children}</div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-6 py-3 flex justify-end gap-3 lg:left-64">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-60 hover:opacity-90"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
