// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dash/", "/dashboard/", "/api/", "/admin/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/dash/", "/dashboard/", "/api/", "/admin/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/blog/", "/services/", "/products/"],
        disallow: ["/dash/", "/dashboard/", "/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}