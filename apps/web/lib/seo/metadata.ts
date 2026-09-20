import type { Metadata } from "next";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE_PATH,
  getSiteUrl,
  SITE_NAME,
  TWITTER_HANDLE,
} from "./site";

const DESCRIPTION_MAX = 160;

export interface PageMetadataInput {
  title: string;
  description?: string;
  path: string;
  ogImage?: string | null;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

export function trimDescription(text: string, max = DESCRIPTION_MAX): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }

  const truncated = normalized.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
}

export function buildPageTitle(pageTitle: string): string {
  if (pageTitle.includes(SITE_NAME)) {
    return pageTitle;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

export function buildCatalogTitle(section: string): string {
  return buildPageTitle(section);
}

export function buildDestinationTitle(name: string): string {
  return buildPageTitle(`${name} Travel Guide`);
}

export function buildStayTitle(name: string, city: string): string {
  return buildPageTitle(`${name} — Stay in ${city}`);
}

export function buildExperienceTitle(name: string, city: string): string {
  return buildPageTitle(`${name} in ${city}`);
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage,
  ogType = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imagePath = ogImage ?? DEFAULT_OG_IMAGE_PATH;
  const imageUrl = imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);

  return {
    title,
    description: trimDescription(description),
    alternates: {
      canonical,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: trimDescription(description),
      url: canonical,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: ogType,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: trimDescription(description),
      images: [imageUrl],
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
    },
  };
}

export function buildNotFoundMetadata(): Metadata {
  return buildPageMetadata({
    title: buildPageTitle("Page not found"),
    description:
      "This page isn't on our map. Explore destinations and start planning your trip with GO WITH US.",
    path: "/404",
    noIndex: true,
  });
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${SITE_NAME} — Travel Discovery & Trip Planning`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    alternates: {
      canonical: absoluteUrl("/"),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${SITE_NAME} — Travel Discovery & Trip Planning`,
      description: DEFAULT_DESCRIPTION,
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: "website",
      images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE_PATH), alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Travel Discovery & Trip Planning`,
      description: DEFAULT_DESCRIPTION,
      images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
    },
  };
}
