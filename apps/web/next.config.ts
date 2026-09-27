import path from "node:path";
import type { NextConfig } from "next";

const apiOrigin = (process.env.API_URL ?? "http://127.0.0.1:4000")
  .trim()
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/i, "");

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isVercel
    ? {}
    : {
        output: "standalone" as const,
        outputFileTracingRoot: path.join(__dirname, "../.."),
      }),
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
  images: {
    qualities: [75, 85, 88, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
