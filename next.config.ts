import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Release the TS improvements gradually:
  // ignoreBuildErrors is removed so type errors fail the build.
  images: {
    // Dev-only images are served from the local Django (localhost:8000).
    // Next blocks private-IP upstreams by default (SSRF guard); allow them.
    dangerouslyAllowLocalIP: true,
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
}

export default nextConfig;
