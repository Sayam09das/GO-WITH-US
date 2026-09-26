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
  },
): StayListItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    destination: item.destination,
    propertyType: normalizePropertyType(item.propertyType),
    propertyTypeLabel: item.propertyType,
    description: item.description ?? item.overview ?? item.name,
    heroImage: item.coverImage ?? item.heroImage ?? "",
    imageAlt: item.imageAlt ?? item.name,
    isFeatured: item.isFeatured,
  };
}

export function mapExperienceListItem(
  item: ApiExperienceListItem & { title?: string; heroImage?: string; description?: string },
): ExperienceListItem {
  const title = item.name ?? item.title ?? "Experience";

  return {
    id: item.id,
    slug: item.slug,
    title,
    destination: item.destination,
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
