import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Allow local uploads without optimization errors
  },
};

export default nextConfig;
