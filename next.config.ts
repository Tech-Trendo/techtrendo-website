import type { NextConfig } from "next";

// Security headers applied to every route. CSP is deliberately permissive
// (inline GA snippet, Google Fonts-free system stack, reCAPTCHA, Maps embed);
// tighten script/style sources once verified against production traffic.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key:
      "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' required by the inline GA4 gtag config snippet.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://app.techtrendo.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.recaptcha.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Release the TS improvements gradually:
  // ignoreBuildErrors is removed so type errors fail the build.
  images: {
    // Dev-only images are served from the local Django (localhost:8000).
    // Next blocks private-IP upstreams by default (SSRF guard); allow them.
    dangerouslyAllowLocalIP: true,
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
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
