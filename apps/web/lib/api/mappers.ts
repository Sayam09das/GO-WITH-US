import type {
  BookingSummary as ApiBookingSummary,
  DestinationListItem as ApiDestinationListItem,
  ExperienceListItem as ApiExperienceListItem,
  RestaurantListItem as ApiRestaurantListItem,
  StayListItem as ApiStayListItem,
  StoryListItem as ApiStoryListItem,
} from "@gowithus/types";
import type { DestinationListItem } from "@/types/destination";
import type { ExperienceListItem } from "@/types/experience";
import type { InspirationStory } from "@/types/inspiration";
import type { JournalStory } from "@/types/journal";
import type { RestaurantListItem } from "@/types/restaurant";
import type { StayListItem } from "@/types/stay";

type CatalogDestinationField =
  | string
  | {
      title: string;
      slug?: string;
      country?: string;
      region?: string;
    };

function resolveCatalogDestinationLabel(
  destination: CatalogDestinationField,
  locationLabel?: string,
): string {
  if (locationLabel?.trim()) {
    return locationLabel.trim();
  }

  if (typeof destination === "string") {
    return destination;
  }

  if (destination.country) {
    return `${destination.title}, ${destination.country}`;
  }

  return destination.title;
}

function formatPropertyTypeLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizePropertyType(value: string): StayListItem["propertyType"] {
  if (
    value === "boutique-hotel" ||
    value === "villa" ||
    value === "eco-lodge" ||
    value === "apartment" ||
    value === "resort" ||
    value === "lodge"
  ) {
    return value === "lodge" ? "boutique-hotel" : value;
  }

  return "boutique-hotel";
}

export function mapDestinationListItem(item: ApiDestinationListItem): DestinationListItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    location: item.location ?? item.title,
    country: item.country,
    region: item.region,
    style: item.style ?? "Discovery",
    category: item.category ?? "Culture",
    budgetTier: item.budgetTier,
    popularity: item.popularity,
    heroImage: item.heroImage,
    imageAlt: item.imageAlt ?? item.title,
    rating: item.rating,
    priceLabel: item.priceLabel,
  };
}

export function mapStayListItem(
  item: ApiStayListItem & {
    heroImage?: string;
    locationLabel?: string;
    overview?: string;
    description?: string;
    destination?: CatalogDestinationField;
  },
): StayListItem {
  const destinationField = (item.destination ?? "") as CatalogDestinationField;

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    destination: resolveCatalogDestinationLabel(destinationField, item.locationLabel),
    propertyType: normalizePropertyType(item.propertyType),
    propertyTypeLabel: formatPropertyTypeLabel(item.propertyType),
    description: item.description ?? item.overview ?? item.name,
    heroImage: item.coverImage ?? item.heroImage ?? "",
    imageAlt: item.imageAlt ?? item.name,
    isFeatured: item.isFeatured,
  };
}

export function mapExperienceListItem(
  item: ApiExperienceListItem & {
    title?: string;
    heroImage?: string;
    description?: string;
    locationLabel?: string;
    destination?: CatalogDestinationField;
  },
): ExperienceListItem {
  const title = item.name ?? item.title ?? "Experience";
  const destinationField = (item.destination ?? "") as CatalogDestinationField;

  return {
    id: item.id,
    slug: item.slug,
    title,
    destination: resolveCatalogDestinationLabel(destinationField, item.locationLabel),
    category: item.category as ExperienceListItem["category"],
    categoryLabel: item.category,
    description: item.description ?? title,
    heroImage: item.heroImage ?? item.coverImage ?? "",
    imageAlt: title,
    isFeatured: item.isFeatured,
  };
}

export function mapRestaurantListItem(item: ApiRestaurantListItem): RestaurantListItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    destination: item.destination,
    cuisine: item.cuisine,
    heroImage: item.coverImage,
    imageAlt: item.name,
    priceLevel: item.priceLevel,
    rating: item.rating,
    reviewCount: item.reviewCount,
  };
}

export function mapJournalStory(item: ApiStoryListItem): JournalStory {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    destination: "GO WITH US",
    excerpt: item.excerpt,
    category: "travel-tips",
    categoryLabel: item.category,
    readLabel: `${item.readTimeMinutes} min read`,
    heroImage: item.coverImage,
    imageAlt: item.title,
    isFeatured: item.isFeatured,
  };
}

export function mapInspirationStory(item: ApiStoryListItem): InspirationStory {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    readLabel: `${item.readTimeMinutes} min read`,
    heroImage: item.coverImage,
    imageAlt: item.title,
    isFeatured: item.isFeatured,
  };
}

export function mapBookingSummary(item: ApiBookingSummary): ApiBookingSummary {
  return item;
}
