import path from "node:path";
import type { NextConfig } from "next";

const apiOrigin = (process.env.API_URL ?? "http://127.0.0.1:4000")
  .trim()
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/i, "");

const isVercel = process.env.VERCEL === "1";

if (isVercel && process.env.NODE_ENV === "production") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!siteUrl || siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set to your public Vercel URL in Production (Project → Environment Variables).",
    );
  }
  const publicApi = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  if (!publicApi.startsWith("/")) {
    throw new Error(
      "NEXT_PUBLIC_API_URL should be /api/v1 on Vercel so session cookies stay same-origin.",
    );
  }
  if (!process.env.API_URL?.trim()) {
    throw new Error("API_URL must point at your hosted API (e.g. Render) on Vercel.");
  }
}

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
