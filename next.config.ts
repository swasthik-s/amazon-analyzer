import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com'], // Allow images from the Amazon domain
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
