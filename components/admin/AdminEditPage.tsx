"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/admin/useAdminAuth";

interface AdminEditPageProps<T> {
  fetchUrl: (key: string) => string;
  backHref: string;
  backLabel: string;
  errorText?: string;
  children: (item: T) => React.ReactNode;
}

export default function AdminEditPage<T>({
  fetchUrl,
  backHref,
  backLabel,
  errorText = "Item not found or could not be loaded.",
  children,
}: AdminEditPageProps<T>) {
  const params = useParams<Record<string, string>>();
  const key = (params.id ?? params.slug ?? params.key ?? "") as string;
  const auth = useAdminAuth();
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key || !auth.checked) return;
    fetch(fetchUrl(key), { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return (await res.json()) as T;
      })
      .then(setItem)
      .catch(() => setError(errorText))
      .finally(() => setLoading(false));
  }, [key, auth.checked, fetchUrl, errorText]);

  if (!auth.checked || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || item === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error ?? errorText}</p>
        <Link href={backHref} className="text-sm text-primary hover:underline">
          {backLabel}
        </Link>
      </div>
    );
  }

  return <>{children(item)}</>;
}
