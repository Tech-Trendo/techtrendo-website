import type { NextConfig } from "next";

// Security headers applied to every route. CSP is deliberately permissive
// (inline GA snippet, Google Fonts-free system stack, reCAPTCHA, Maps embed,
// Cloudflare Web Analytics beacon injected at the edge); tighten script/style
// sources once verified against production traffic.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // `interest-cohort` was removed from Chrome (FLoC is gone) and triggers an
    // "Unrecognized feature" console warning. `browsing-topics` is its Topics
    // API successor; unrecognized tokens are ignored by older browsers.
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key:
      "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' required by the inline GA4 gtag config snippet.
      // Cloudflare's edge injects its Web Analytics beacon when enabled in the
      // dashboard, so both the script host and its RUM endpoint must be allowed.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://app.techtrendo.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://cloudflareinsights.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.recaptcha.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

// Dev-only images are served from the local Django (localhost:8000). Next
// blocks private-IP upstreams by default (SSRF guard), so only relax that
// guard outside production and only when the API really points at localhost.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ALLOW_LOCAL_IMAGES =
  process.env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(API_ORIGIN);

const nextConfig: NextConfig = {
  // Release the TS improvements gradually:
  // ignoreBuildErrors is removed so type errors fail the build.
  images: {
    dangerouslyAllowLocalIP: ALLOW_LOCAL_IMAGES,
    formats: ["image/avif", "image/webp"],
    // Keep optimized images cacheable at the CDN edge (previously re-hit the
    // optimizer on every request).
    minimumCacheTTL: 2_678_400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.techtrendo.com",
        pathname: "/media/**",
      },
      ...(ALLOW_LOCAL_IMAGES
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "8000",
              pathname: "/media/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  // Legacy WordPress/WooCommerce URLs still crawled from the old site. They
  // were never redirected at migration time, so Google keeps re-reporting them
  // as 404s. Send each family to the closest current page (308 = permanent).
  async redirects() {
    return [
      // Old WordPress core paths.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/pages", destination: "/", permanent: true },
      { source: "/pages/:path*", destination: "/", permanent: true },
      { source: "/courses", destination: "/services", permanent: true },

      // Old WordPress archives and feeds.
      { source: "/author/:path*", destination: "/about", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/feed/:path*", destination: "/blog", permanent: true },
      { source: "/comments/feed", destination: "/blog", permanent: true },
      { source: "/comments/feed/:path*", destination: "/blog", permanent: true },

      // Old tutorial/topic pages. Keep the specific matches before the wildcard.
      { source: "/topics/about.html", destination: "/about", permanent: true },
      { source: "/topics/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/topics/terms-of-service", destination: "/terms", permanent: true },
      { source: "/topics/:path*", destination: "/blog", permanent: true },

      // Old WooCommerce demo shop (products, categories, cart, feeds, filters).
      { source: "/shop/:path*", destination: "/products", permanent: true },

      // Removed team profile pages.
      { source: "/team/:path*", destination: "/about", permanent: true },
      { source: "/ayush-giri", destination: "/about", permanent: true },
      { source: "/rishav-khatiwada", destination: "/about", permanent: true },
      { source: "/adhyan-basnet", destination: "/about", permanent: true },
      { source: "/sujan-sah", destination: "/about", permanent: true },
      { source: "/raghav-phuyal", destination: "/about", permanent: true },

      // Old root-level blog posts.
      { source: "/5-benefit-of-using-a-smart-contract", destination: "/blog", permanent: true },
      { source: "/sony-aibo-ers1000-next-digital-pet", destination: "/blog", permanent: true },
      { source: "/who-is-alibaba", destination: "/blog", permanent: true },
      { source: "/two-area-robot-beat-human-must-know", destination: "/blog", permanent: true },

      // Old WordPress sitemap endpoints -> current sitemap.
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },

      // Cloudflare rewrites footer email links to this path. The endpoint is
      // returning 404 on this host, so send visitors to the contact page.
      // Best fix is to disable Cloudflare Email Address Obfuscation.
      { source: "/cdn-cgi/l/email-protection", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
