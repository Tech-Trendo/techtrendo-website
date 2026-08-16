"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { AdminMarketPage } from "@/lib/admin-types";
import { apiErrorText, slugify, submitAdminResource } from "@/lib/admin-submit";
import AdminForm, { inputClassName } from "@/components/admin/AdminForm";
import SeoFields from "@/components/admin/SeoFields";

interface MarketPageFormProps {
  mode: "create" | "edit";
  item?: AdminMarketPage | null;
}

interface Option {
  id: number;
  title: string;
  author_name?: string;
}

function extractOptions(data: unknown): Option[] {
  if (Array.isArray(data)) return data as Option[];
  return ((data as { results?: Option[] }).results ?? []) as Option[];
}

export default function MarketPageForm({ mode, item }: MarketPageFormProps) {
  const router = useRouter();
  const [countryName, setCountryName] = useState(item?.country_name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(item));
  const [heroIntro, setHeroIntro] = useState(item?.hero_intro ?? "");
  const [timezoneNote, setTimezoneNote] = useState(item?.timezone_note ?? "");
  const [status, setStatus] = useState<"draft" | "published">(item?.status ?? "draft");
  const [serviceIds, setServiceIds] = useState<number[]>(item?.services_offered.map((s) => s.id) ?? []);
  const [portfolioIds, setPortfolioIds] = useState<number[]>(item?.regional_portfolio.map((p) => p.id) ?? []);
  const [testimonialIds, setTestimonialIds] = useState<number[]>(item?.regional_testimonials.map((t) => t.id) ?? []);
  const [services, setServices] = useState<Option[]>([]);
  const [portfolios, setPortfolios] = useState<Option[]>([]);
  const [testimonials, setTestimonials] = useState<Option[]>([]);
  const [seo, setSeo] = useState({
    meta_title: item?.meta_title,
    meta_description: item?.meta_description,
    meta_keywords: item?.meta_keywords,
    og_title: item?.og_title,
    og_description: item?.og_description,
    canonical_url: item?.canonical_url,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/services?page_size=100", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/portfolio?page_size=100", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/testimonials?page_size=100", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([s, p, t]) => {
        setServices(extractOptions(s));
        setPortfolios(extractOptions(p));
        setTestimonials(extractOptions(t));
      })
      .catch(() => undefined);
  }, []);

  const toggle = (list: number[], id: number): number[] =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const handleSubmit = async () => {
    if (!countryName.trim()) {
      setError("Country name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        country_name: countryName.trim(),
        hero_intro: heroIntro,
        timezone_note: timezoneNote.trim() || null,
        status,
        services_offered_ids: serviceIds,
        regional_portfolio_ids: portfolioIds,
        regional_testimonials_ids: testimonialIds,
        meta_title: seo.meta_title?.trim() || null,
        meta_description: seo.meta_description?.trim() || null,
        meta_keywords: seo.meta_keywords?.trim() || null,
        og_title: seo.og_title?.trim() || null,
        og_description: seo.og_description?.trim() || null,
        canonical_url: seo.canonical_url?.trim() || null,
      };
      if (slug.trim()) payload.slug = slug.trim();
      const url = mode === "edit" && item ? `/api/admin/markets/${item.slug}` : "/api/admin/markets";
      const res = await submitAdminResource(url, mode === "edit" ? "PATCH" : "POST", payload);
      if (!res.ok) {
        setError((await apiErrorText(res)) ?? "Something went wrong while saving.");
        return;
      }
      toast.success(mode === "edit" ? "Market page updated." : "Market page created.");
      router.push("/admin/markets");
    } finally {
      setSubmitting(false);
    }
  };

  const renderMultiSelect = (
    label: string,
    options: Option[],
    selected: number[],
    onToggle: (id: number) => void,
    display: (o: Option) => string,
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="border border-input rounded-md bg-background max-h-44 overflow-y-auto divide-y divide-border">
        {options.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">No options available.</p>}
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={selected.includes(o.id)}
              onChange={() => onToggle(o.id)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="truncate">{display(o)}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <AdminForm
      title={mode === "edit" ? "Edit Market Page" : "New Market Page"}
      backHref="/admin/markets"
      submitLabel={mode === "edit" ? "Save changes" : "Create page"}
      submitting={submitting}
      onSubmit={() => void handleSubmit()}
      error={error}
    >
      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Country name <span className="text-destructive">*</span>
            </label>
            <input
              value={countryName}
              onChange={(e) => {
                setCountryName(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
              className={inputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
              className={inputClassName()}
              placeholder="auto-generated from country"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className={inputClassName()}>
              <option value="draft">Draft (noindex)</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone note</label>
            <input value={timezoneNote} onChange={(e) => setTimezoneNote(e.target.value)} className={inputClassName()} placeholder="e.g. 4-9 hour overlap with your working day" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hero intro (HTML)</label>
          <textarea value={heroIntro} onChange={(e) => setHeroIntro(e.target.value)} rows={6} className={inputClassName()} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-4 space-y-4 bg-card">
        {renderMultiSelect("Services offered", services, serviceIds, (id) => setServiceIds((l) => toggle(l, id)), (o) => o.title)}
        {renderMultiSelect("Regional portfolio", portfolios, portfolioIds, (id) => setPortfolioIds((l) => toggle(l, id)), (o) => o.title)}
        {renderMultiSelect(
          "Regional testimonials",
          testimonials,
          testimonialIds,
          (id) => setTestimonialIds((l) => toggle(l, id)),
          (o) => o.author_name ?? o.title,
        )}
      </section>

      <SeoFields values={seo} onChange={(next) => setSeo((prev) => ({ ...prev, ...next }))} />
    </AdminForm>
  );
}
