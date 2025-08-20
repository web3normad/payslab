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
  // Allow external image domains
  images: {
    domains: [
      'localhost',
      // Add your domains here as needed
    ],
    unoptimized: true, // Disable image optimization if needed
  },
  // Experimental features
  experimental: {
    // Add any experimental features if needed
    forceSwcTransforms: true,
  },
  // Webpack configuration to suppress warnings
  webpack: (config, { dev, isServer }) => {
    // Suppress specific warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];
    
    // Add fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },
  // Output configuration
  output: 'standalone', // For better deployment compatibility
  
  // Disable strict mode warnings
  reactStrictMode: false,
  
  // Disable powered by header
  poweredByHeader: false,
};

export default nextConfig;