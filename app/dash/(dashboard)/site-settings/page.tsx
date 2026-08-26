"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AdminSiteSettings } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/useAdminAuth";
import { apiErrorText } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";

export default function AdminSiteSettingsPage() {
  const auth = useAdminAuth();
  const [settings, setSettings] = useState<AdminSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [siteKey, setSiteKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.checked) return;
    fetch("/api/admin/site-settings/1", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return (await res.json()) as AdminSiteSettings;
      })
      .then((data) => {
        setSettings(data);
        setSiteName(data.site_name ?? "");
        setSecretKey(data.recaptcha_secret_key ?? "");
        setSiteKey(data.recaptcha_site_key ?? "");
      })
      .catch(() => setLoadError("Could not load site settings."))
      .finally(() => setLoading(false));
  }, [auth.checked]);

  const handleSubmit = async () => {
    if (!siteName.trim()) {
      setError("Site name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-settings/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: siteName.trim(),
          recaptcha_secret_key: secretKey.trim() || null,
          recaptcha_site_key: siteKey.trim() || null,
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success("Site settings saved.");
    } catch {
      setError("Could not save site settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.checked || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (loadError || settings === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{loadError ?? "Site settings unavailable."}</p>
      </div>
    );
  }

  return (
    <AdminForm
      title="Site Settings"
      backHref="/dash"
      submitLabel="Save settings"
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div>
          <label className="block text-sm font-medium mb-1">
            Site name <span className="text-destructive">*</span>
          </label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClassName()} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">reCAPTCHA secret key</label>
          <input
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            type="password"
            autoComplete="off"
            placeholder="Server-side verification key"
            className={inputClassName()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">reCAPTCHA site key</label>
          <input
            value={siteKey}
            onChange={(e) => setSiteKey(e.target.value)}
            autoComplete="off"
            placeholder="Client-side site key"
            className={inputClassName()}
          />
        </div>
      </section>
    </AdminForm>
  );
}
