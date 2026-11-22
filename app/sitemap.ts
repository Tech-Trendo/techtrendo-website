import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

// Scale note: at current content volume a single sitemap (max ~50k URLs / 50MB)
// is fine. If blog/product/service counts grow substantially, split each content
// type into its own route (e.g. app/sitemap-blog.ts, app/sitemap-service.ts) and
// return a MetadataRoute.SitemapIndex from this file pointing at sitemap-N.xml.

// Next.js caches metadata routes at build time by default. The hosted copy was
// serving a stale snapshot (missing posts/products published after the build),
// so force request-time rendering and bypass the fetch Data Cache. Sitemaps are
// low-traffic; five small API reads per crawl request are acceptable.
export const dynamic = "force-dynamic";

// Statics without CMS-tracked update dates omit lastmod entirely instead of
// stamping a fake sitewide date (Google ignores unreliable lastmod values).

type EntryCfg = {
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

const STATIC_URLS: { path: string; cfg: EntryCfg }[] = [
  { path: "/", cfg: { changeFrequency: "weekly", priority: 1.0 } },
  { path: "/about", cfg: { changeFrequency: "monthly", priority: 0.8 } },
  { path: "/careers", cfg: { changeFrequency: "weekly", priority: 0.8 } },
  { path: "/outsource", cfg: { changeFrequency: "monthly", priority: 0.8 } },
  { path: "/contact", cfg: { changeFrequency: "monthly", priority: 0.8 } },
  { path: "/quote", cfg: { changeFrequency: "monthly", priority: 0.7 } },
  { path: "/verify", cfg: { changeFrequency: "monthly", priority: 0.5 } },
  { path: "/markets", cfg: { changeFrequency: "monthly", priority: 0.5 } },
  { path: "/locations/eastern-nepal", cfg: { changeFrequency: "monthly", priority: 0.6 } },
  { path: "/portfolio", cfg: { changeFrequency: "monthly", priority: 0.7 } },
  { path: "/privacy", cfg: { changeFrequency: "yearly", priority: 0.3 } },
  { path: "/terms", cfg: { changeFrequency: "yearly", priority: 0.3 } },
  { path: "/refund-policy", cfg: { changeFrequency: "yearly", priority: 0.3 } },
];

// CMS Page slug -> frontend route (slug may differ from the route, e.g.
// "service" renders at /services). Mirrors backend/app/models.py Page.PAGE_ROUTES.
const PAGE_ROUTES: Record<string, EntryCfg & { path: string }> = {
  about: { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  blog: { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  careers: { path: "/careers", changeFrequency: "weekly", priority: 0.8 },
  contact: { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  markets: { path: "/markets", changeFrequency: "monthly", priority: 0.5 },
  "locations-eastern-nepal": { path: "/locations/eastern-nepal", changeFrequency: "monthly", priority: 0.6 },
  outsource: { path: "/outsource", changeFrequency: "monthly", priority: 0.8 },
  products: { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  service: { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  services: { path: "/services", changeFrequency: "weekly", priority: 0.9 },
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function lastModOf(date: string | null | undefined): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().split("T")[0];
}

function toUrl(
  path: string,
  cfg: EntryCfg,
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return lastModified
    ? { url: `${SITE_URL}${path}`, lastModified, changeFrequency: cfg.changeFrequency, priority: cfg.priority }
    : { url: `${SITE_URL}${path}`, changeFrequency: cfg.changeFrequency, priority: cfg.priority };
}

type ListItem = { slug?: string; updated_at?: string | null; pub_date?: string | null; status?: string };

function listOf(data: unknown): ListItem[] {
  if (Array.isArray(data)) return data as ListItem[];
  if (data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: ListItem[] }).results;
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const { path, cfg } of STATIC_URLS) {
    entries.set(`${SITE_URL}${path}`, toUrl(path, cfg));
  }

  const [blogsData, services, products, pages, markets] = await Promise.all([
    fetchJson<unknown>("/blogs/?page_size=100"),
    fetchJson<unknown>("/services/"),
    fetchJson<unknown>("/products/"),
    fetchJson<unknown>("/pages/"),
    fetchJson<unknown>("/markets/?page_size=100"),
  ]);

  const pageItems = listOf(pages).map((item) => ({
    slug: item.slug ?? "",
    updated_at: item.updated_at,
  }));

  // CMS pages override fixed statics so about/blog/careers/... carry real dates.
  for (const page of pageItems) {
    const route = PAGE_ROUTES[page.slug];
    if (!route) continue;
    const url = `${SITE_URL}${route.path}`;
    entries.set(url, toUrl(route.path, route, lastModOf(page.updated_at)));
  }

  for (const blog of listOf(blogsData)) {
    const slug = blog.slug ?? "";
    if (!slug) continue;
    const path = `/blog/${slug}`;
    const lastModified = lastModOf(blog.updated_at) ?? lastModOf(blog.pub_date);
    entries.set(`${SITE_URL}${path}`, toUrl(path, { changeFrequency: "weekly", priority: 0.7 }, lastModified));
  }

  for (const service of listOf(services)) {
    const slug = service.slug ?? "";
    if (!slug) continue;
    const path = `/services/${slug}`;
    entries.set(`${SITE_URL}${path}`, toUrl(path, { changeFrequency: "monthly", priority: 0.8 }, lastModOf(service.updated_at)));
  }

  for (const product of listOf(products)) {
    const slug = product.slug ?? "";
    if (!slug) continue;
    const path = `/products/${slug}`;
    entries.set(`${SITE_URL}${path}`, toUrl(path, { changeFrequency: "monthly", priority: 0.8 }, lastModOf(product.updated_at)));
  }

  // Markets: only status=published pages belong in the sitemap. Draft market
  // pages are noindex and must not be crawled at all.
  const publishedMarkets = listOf(markets).filter(
    (m) => m?.status === "published",
  );
  for (const market of publishedMarkets) {
    const slug = market.slug ?? "";
    if (!slug) continue;
    const path = `/markets/${slug}`;
    entries.set(`${SITE_URL}${path}`, toUrl(path, { changeFrequency: "monthly", priority: 0.6 }, lastModOf(market.updated_at)));
  }

  // Portfolio has no public detail route yet (homepage section only), so it is
  // intentionally omitted to avoid 404 sitemap entries. When /portfolio/[slug]
  // ships, add the fetch below (portfolio/ has updated_at) with
  // changeFrequency "monthly", priority 0.6, path `/portfolio/${slug}`.

  return [...entries.values()];
}