export const SITE_NAME = "GO WITH US";

export const SITE_TAGLINE = "Discover places. Save what inspires you. Build your trip.";

export const DEFAULT_DESCRIPTION =
  "Discover destinations, explore stays and experiences, save places, and build personalized day-by-day travel itineraries.";

export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";

export const TWITTER_HANDLE = undefined as string | undefined;

export const DEFAULT_LOCALE = "en_US";

/** Absolute site origin — used for canonical URLs, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
