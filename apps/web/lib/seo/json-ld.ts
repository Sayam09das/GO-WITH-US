import { absoluteUrl } from "./site";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface EntityJsonLdInput {
  name: string;
  description: string;
  path: string;
  image?: string | null;
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GO WITH US",
    url: absoluteUrl("/"),
    description:
      "Discover destinations, explore stays and experiences, save places, and build personalized day-by-day travel itineraries.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildDestinationJsonLd({ name, description, path, image }: EntityJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function buildStayJsonLd({ name, description, path, image }: EntityJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function buildExperienceJsonLd({ name, description, path, image }: EntityJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export type JsonLd = Record<string, unknown>;
