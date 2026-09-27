import type { Destination, Restaurant } from "@prisma/client";

export type RestaurantDestinationSummary = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
};

export type RestaurantListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  cuisine: string;
  coverImage: string;
  priceLevel: number;
  priceLabel: string;
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  source?: "catalog" | "provider";
  provider?: string;
  providerPlaceId?: string;
  address?: string | null;
  location?: {
    city: string | null;
    country: string | null;
    latitude: number;
    longitude: number;
  };
};

export type RestaurantDetail = {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  destination: RestaurantDestinationSummary;
  priceLevel: number;
  priceLabel: string;
  openingHours: unknown | null;
  address: string | null;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  menu: {
    highlights: string[];
  };
  amenities: string[];
  reviews: {
    average: number;
    count: number;
  };
  isSaved: boolean;
};

function decimalToNumber(value: { toNumber(): number } | null | undefined): number {
  return value ? Number(value.toNumber()) : 0;
}

function decimalToNullableNumber(value: { toNumber(): number } | null | undefined): number | null {
  return value != null ? Number(value.toNumber()) : null;
}

export function priceLevelLabel(level: number): string {
  return "$".repeat(Math.min(Math.max(level, 1), 4));
}

export function toRestaurantDestinationSummary(
  destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">,
): RestaurantDestinationSummary {
  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    region: destination.region,
  };
}

export function toRestaurantListItem(
  restaurant: Restaurant & {
    destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">;
  },
  isSaved = false,
): RestaurantListItem {
  return {
    id: restaurant.id,
    name: restaurant.title,
    slug: restaurant.slug,
    destination: restaurant.destination.title,
    destinationSlug: restaurant.destination.slug,
    cuisine: restaurant.cuisine,
    coverImage: restaurant.heroImage,
    priceLevel: restaurant.priceLevel,
    priceLabel: priceLevelLabel(restaurant.priceLevel),
    rating: decimalToNumber(restaurant.ratingAvg),
    reviewCount: restaurant.reviewCount,
    isSaved,
  };
}

export function toRestaurantDetail(
  restaurant: Restaurant & { destination: Destination },
  isSaved = false,
): RestaurantDetail {
  return {
    id: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.title,
    cuisine: restaurant.cuisine,
    heroImage: restaurant.heroImage,
    gallery: restaurant.gallery,
    overview: restaurant.overview,
    destination: toRestaurantDestinationSummary(restaurant.destination),
    priceLevel: restaurant.priceLevel,
    priceLabel: priceLevelLabel(restaurant.priceLevel),
    openingHours: restaurant.openingHours,
    address: restaurant.address,
    coordinates: {
      latitude: decimalToNullableNumber(restaurant.latitude),
      longitude: decimalToNullableNumber(restaurant.longitude),
    },
    menu: {
      highlights: restaurant.menuHighlights,
    },
    amenities: restaurant.amenities,
    reviews: {
      average: decimalToNumber(restaurant.ratingAvg),
      count: restaurant.reviewCount,
    },
    isSaved,
  };
}

export function buildPaginationMeta(input: { page: number; limit: number; total: number }) {
  return {
    page: input.page,
    limit: input.limit,
    total: input.total,
    totalPages: Math.max(1, Math.ceil(input.total / input.limit)),
  };
}
