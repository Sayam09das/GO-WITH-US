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
import {
  getDestinationEditorial,
  getExperienceEditorial,
  getInspirationEditorial,
  getJournalEditorial,
  getStayEditorial,
} from "./catalog-enrichment";

export function mapDestinationListItem(item: ApiDestinationListItem): DestinationListItem {
  const editorial = getDestinationEditorial(item.slug);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    location: editorial?.location ?? item.title,
    country: item.country,
    region: item.region,
    style: editorial?.style ?? item.style ?? "Discovery",
    category: editorial?.category ?? item.category ?? "Editorial",
    budgetTier: item.budgetTier,
    popularity: editorial?.popularity ?? item.popularity,
    heroImage: item.heroImage,
    imageAlt: editorial?.imageAlt ?? item.imageAlt,
    rating: item.rating,
    priceLabel: editorial?.priceLabel ?? item.priceLabel,
    objectPosition: editorial?.objectPosition,
  };
}

function resolveStayDestination(
  destination: ApiStayListItem["destination"] | { title?: string } | string | null | undefined,
): string {
  if (typeof destination === "string") {
    return destination;
  }

  if (destination && typeof destination === "object" && "title" in destination) {
    return destination.title ?? "Unknown";
  }

  return "Unknown";
}

export function mapStayListItem(
  item: ApiStayListItem & {
    heroImage?: string;
    locationLabel?: string;
    overview?: string;
    description?: string;
  },
): StayListItem {
  const editorial = getStayEditorial(item.slug);

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    destination: resolveStayDestination(item.destination),
    propertyType: (editorial?.propertyType ?? item.propertyType) as StayListItem["propertyType"],
    propertyTypeLabel: editorial?.propertyTypeLabel ?? item.propertyType,
    description: editorial?.description ?? item.description ?? item.overview ?? item.name,
    heroImage: item.coverImage ?? item.heroImage ?? "",
    imageAlt: editorial?.imageAlt ?? item.imageAlt,
    objectPosition: editorial?.objectPosition,
    isFeatured: editorial?.isFeatured,
    layoutVariant: editorial?.layoutVariant,
  };
}

export function mapExperienceListItem(item: ApiExperienceListItem): ExperienceListItem {
  const editorial = getExperienceEditorial(item.slug);

  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    destination: item.destination,
    category: (editorial?.category ?? item.category) as ExperienceListItem["category"],
    categoryLabel: editorial?.categoryLabel ?? item.category,
    description: editorial?.description ?? item.name,
    heroImage: item.coverImage,
    imageAlt: editorial?.imageAlt ?? item.name,
    objectPosition: editorial?.objectPosition,
    isFeatured: editorial?.isFeatured,
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
  const editorial = getJournalEditorial(item.slug);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    destination: editorial?.destination ?? "GO WITH US",
    excerpt: item.excerpt,
    category: (editorial?.category ?? "travel-tips") as JournalStory["category"],
    categoryLabel: editorial?.categoryLabel ?? item.category,
    readLabel: editorial?.readLabel ?? `${item.readTimeMinutes} min read`,
    heroImage: item.coverImage,
    imageAlt: editorial?.imageAlt ?? item.title,
    objectPosition: editorial?.objectPosition,
    isFeatured: item.isFeatured,
    layoutVariant: editorial?.layoutVariant,
  };
}

export function mapInspirationStory(item: ApiStoryListItem): InspirationStory {
  const editorial = getInspirationEditorial(item.slug);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: editorial?.category ?? item.category,
    readLabel: editorial?.readLabel ?? `${item.readTimeMinutes} min read`,
    heroImage: item.coverImage,
    imageAlt: editorial?.imageAlt ?? item.title,
    objectPosition: editorial?.objectPosition,
    isFeatured: item.isFeatured,
  };
}

export function mapBookingSummary(item: ApiBookingSummary): ApiBookingSummary {
  return item;
}
