import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

const REVALIDATE = 3600;
const LAST_MOD = "2026-06-15";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: LAST_MOD, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: LAST_MOD, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/careers`, lastModified: LAST_MOD, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/courses`, lastModified: LAST_MOD, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/outsource`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/products`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/quote`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/verify`, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [blogsData, services, products, members, pages] = await Promise.all([
    fetchJson<{ results?: { slug?: string; pub_date?: string }[] }>(
      "/blogs/?page_size=100",
    ),
    fetchJson<{ slug?: string }[]>("/services/"),
    fetchJson<{ slug?: string }[]>("/products/"),
    fetchJson<{ slug?: string }[]>("/members/"),
    fetchJson<{ slug?: string }[]>("/pages/"),
  ]);

  const blogUrls: MetadataRoute.Sitemap = (blogsData?.results || []).map(
    (blog) => {
      const slug = blog.slug ?? "";
      return {
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: lastModOf(blog.pub_date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    },
  );

  const serviceUrls: MetadataRoute.Sitemap = (services || []).map(
    (service) => ({
      url: `${SITE_URL}/services/${service.slug ?? ""}`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const productUrls: MetadataRoute.Sitemap = (products || []).map(
    (product) => ({
      url: `${SITE_URL}/products/${product.slug ?? ""}`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const memberUrls: MetadataRoute.Sitemap = (members || []).map(
    (member) => ({
      url: `${SITE_URL}/${member.slug ?? ""}`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  // CMS pages map to real routes (e.g. /api/app/pages/about -> /about)
  const pageToRoute: Record<string, string> = {
    about: "/about",
    blog: "/blog",
    contact: "/contact",
    careers: "/careers",
    outsource: "/outsource",
    products: "/products",
    service: "/services",
    services: "/services",
  };
  const existingRoutes = new Set(staticUrls.map((u) => u.url));
  const pageUrls = (pages || []).flatMap((page) => {
    const route = pageToRoute[page.slug ?? ""];
    if (!route) return [];
    const url = `${SITE_URL}${route}`;
    if (existingRoutes.has(url)) return [];
    return [
      {
        url,
        lastModified: LAST_MOD,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
    ];
  });

  return [
    ...staticUrls,
    ...blogUrls,
    ...serviceUrls,
    ...productUrls,
    ...memberUrls,
    ...pageUrls,
  ];
}