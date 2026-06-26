import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Force static export if you want raw HTML files

  // 2. Ignore TypeScript compilation errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. Ignore ESLint linting warnings/errors
};

export default nextConfig;
