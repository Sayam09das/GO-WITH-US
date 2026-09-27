import path from "node:path";
import type { NextConfig } from "next";

function normalizeOrigin(value: string): string {
  return value
    .trim()
    .replace(/\/$/, "")
    .replace(/^https?:\/\//, "");
}

/** Vercel injects VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL when NEXT_PUBLIC_SITE_URL is unset. */
function applyVercelPublicEnvDefaults(): void {
  if (process.env.VERCEL !== "1") {
    return;
  }

  const siteExplicit = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const siteIsLocal = siteExplicit.includes("localhost") || siteExplicit.includes("127.0.0.1");

  if (!siteExplicit || siteIsLocal) {
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    const deploymentHost = process.env.VERCEL_URL?.trim();
    const host = productionHost || deploymentHost;
    if (host) {
      process.env.NEXT_PUBLIC_SITE_URL = `https://${normalizeOrigin(host)}`;
    }
  }

  if (!process.env.NEXT_PUBLIC_API_URL?.trim()) {
    process.env.NEXT_PUBLIC_API_URL = "/api/v1";
  }
}

applyVercelPublicEnvDefaults();

const apiOrigin = (process.env.API_URL ?? "http://127.0.0.1:4000")
  .trim()
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/i, "");

const isVercel = process.env.VERCEL === "1";

if (isVercel && process.env.NODE_ENV === "production") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!siteUrl || siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
    throw new Error(
      "Set NEXT_PUBLIC_SITE_URL in Vercel, or rely on VERCEL_PROJECT_PRODUCTION_URL (custom domain on the project).",
    );
  }
  if (!process.env.API_URL?.trim()) {
    throw new Error("Set API_URL on Vercel to your Render API URL (see README Production URLs).");
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
