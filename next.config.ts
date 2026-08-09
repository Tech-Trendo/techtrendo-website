import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Release the TS improvements gradually:
  // ignoreBuildErrors is removed so type errors fail the build.
}

export default nextConfig;
