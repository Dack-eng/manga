import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    '/**': ['./prisma/dev.db']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
