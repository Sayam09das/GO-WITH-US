import type { Destination, Place, PlaceCategory } from "../../generated/client.js";

export type PlaceDestinationSummary = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
};

export type PlaceListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  category: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  location?: {
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  };
};

export type PlaceDetail = {
  id: string;
  slug: string;
  name: string;
  category: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  destination: PlaceDestinationSummary;
  locationLabel: string | null;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  tags: string[];
  reviews: {
    average: number;
    count: number;
  };
};

function decimalToNumber(value: { toNumber(): number } | null | undefined): number {
  return value ? Number(value.toNumber()) : 0;
}

function decimalToNullableNumber(value: { toNumber(): number } | null | undefined): number | null {
  return value != null ? Number(value.toNumber()) : null;
}

export function formatPlaceCategory(category: PlaceCategory): string {
  return category.replace("_", " ");
}

export function toPlaceDestinationSummary(
  destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">,
): PlaceDestinationSummary {
  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    region: destination.region,
  };
}

export function toPlaceListItem(
  place: Place & {
    destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">;
  },
): PlaceListItem {
  return {
    id: place.id,
    name: place.title,
    slug: place.slug,
    destination: place.destination.title,
    destinationSlug: place.destination.slug,
    category: formatPlaceCategory(place.category),
    coverImage: place.heroImage,
    rating: decimalToNumber(place.ratingAvg),
    reviewCount: place.reviewCount,
    tags: place.categoryTags,
    location: {
      city: place.locationLabel,
      country: place.destination.country,
      latitude: decimalToNullableNumber(place.latitude),
      longitude: decimalToNullableNumber(place.longitude),
    },
  };
}

export function toPlaceDetail(place: Place & { destination: Destination }): PlaceDetail {
  return {
    id: place.id,
    slug: place.slug,
    name: place.title,
    category: formatPlaceCategory(place.category),
    heroImage: place.heroImage,
    gallery: place.gallery,
    overview: place.overview,
    destination: toPlaceDestinationSummary(place.destination),
    locationLabel: place.locationLabel,
    coordinates: {
      latitude: decimalToNullableNumber(place.latitude),
      longitude: decimalToNullableNumber(place.longitude),
    },
    tags: place.categoryTags,
    reviews: {
      average: decimalToNumber(place.ratingAvg),
      count: place.reviewCount,
    },
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

export function placeToCatalogPlace(place: PlaceListItem) {
  return {
    id: place.id,
    name: place.name,
    category: place.category,
    city: place.destination,
    country: place.location?.country ?? null,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    rating: place.rating,
    image: place.coverImage || null,
  };
}
