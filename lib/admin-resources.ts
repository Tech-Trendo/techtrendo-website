/**
 * Map of admin resource names to their backend API prefix and the cache
 * tags/paths to invalidate after writes. Used by the generic admin API
 * proxy routes at /api/admin/[resource] and /api/admin/[resource]/[key].
 */
export interface AdminResourceConfig {
  /** Backend API prefix, e.g. "/api/app/services". */
  backend: string;
  /** Public fetch tags to revalidate after a successful write. */
  revalidateTags?: string[];
  /** Public page paths to revalidate after a successful write. */
  revalidatePaths?: string[];
}

export const ADMIN_RESOURCES: Record<string, AdminResourceConfig> = {
  services: {
    backend: "/api/app/services",
    revalidateTags: ["service"],
    revalidatePaths: ["/services"],
  },
  products: {
    backend: "/api/app/products",
    revalidateTags: ["product"],
    revalidatePaths: ["/products"],
  },
  portfolio: {
    backend: "/api/app/portfolio",
    revalidateTags: ["portfolio"],
    revalidatePaths: [],
  },
  pages: {
    backend: "/api/app/pages-admin",
    revalidateTags: ["page"],
    revalidatePaths: [],
  },
  testimonials: {
    backend: "/api/app/testimonials",
    revalidateTags: ["page"],
    revalidatePaths: [],
  },
  "student-testimonials": {
    backend: "/api/app/student-testimonials",
    revalidateTags: ["page"],
    revalidatePaths: [],
  },
  reviews: {
    backend: "/api/app/reviews",
    revalidateTags: ["review"],
    revalidatePaths: [],
  },
  events: {
    backend: "/api/app/events",
    revalidateTags: ["page"],
    revalidatePaths: [],
  },
  "gallery-items": {
    backend: "/api/app/gallery-items",
    revalidateTags: ["gallery"],
    revalidatePaths: [],
  },
  "company-logos": {
    backend: "/api/app/company-logos",
    revalidateTags: ["page"],
    revalidatePaths: [],
  },
  markets: {
    backend: "/api/app/markets",
    revalidateTags: ["market"],
    revalidatePaths: ["/markets"],
  },
  "blog-categories": {
    backend: "/api/app/blog-categories",
    revalidateTags: ["blog"],
    revalidatePaths: ["/blog"],
  },
};
