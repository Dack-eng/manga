import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
