import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other config options here
  experimental: {
    // Add any experimental features if needed
  },
  images: {
    // Configure image domains if needed
    domains: [],
  },
};

export default nextConfig;