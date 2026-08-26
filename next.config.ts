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
};

export default nextConfig;
