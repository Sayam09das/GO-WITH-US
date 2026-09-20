import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/destinations", "/stays", "/experiences"],
      disallow: [
        "/saved",
        "/trips",
        "/account",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
