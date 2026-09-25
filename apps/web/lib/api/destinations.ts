import type { DestinationListItem as ApiDestinationListItem } from "@gowithus/types";
import { DESTINATIONS_FIXTURE } from "@/data/fixtures/loaders/destinations";
import { filterDestinations } from "@/lib/destinations/catalog/filter";
import type { DestinationCatalogFilters, DestinationListItem } from "@/types/destination";
import { apiFetch } from "./client";
import { mapDestinationListItem } from "./mappers";

type DestinationListResponse = {
  destinations: ApiDestinationListItem[];
};

type DestinationDetailResponse = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  climateNotes: string | null;
  currency: string | null;
  primaryLanguage: string | null;
  transportTips: string | null;
  budgetTier: DestinationListItem["budgetTier"];
  bestTimeToVisit: string | null;
  categoryTags: string[];
  travelStyles: string[];
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  location: {
    country: string;
    region: string;
  };
  stays: Array<{
    id: string;
    slug: string;
    title: string;
    propertyType: string;
    locationLabel: string;
    heroImage: string;
    priceTier: DestinationListItem["budgetTier"];
    rating: number;
  }>;
  experiences: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    durationLabel: string | null;
    heroImage: string;
    priceTier: DestinationListItem["budgetTier"];
    rating: number;
  }>;
  relatedDestinations: ApiDestinationListItem[];
};

async function fetchAllDestinations(): Promise<DestinationListItem[]> {
  try {
    const featured = await apiFetch<DestinationListResponse>("/destinations/featured");
    const listed = await apiFetch<DestinationListResponse>("/destinations?limit=100&page=1");

    const merged = new Map<string, DestinationListItem>();
    for (const item of [...featured.destinations, ...listed.destinations]) {
      merged.set(item.slug, mapDestinationListItem(item));
    }

    return [...merged.values()];
  } catch {
    return DESTINATIONS_FIXTURE;
  }
}

export async function getPopularDestinations(limit = 6): Promise<DestinationListItem[]> {
  try {
    const response = await apiFetch<DestinationListResponse>("/destinations/featured");
    return response.destinations.slice(0, limit).map(mapDestinationListItem);
  } catch {
    return DESTINATIONS_FIXTURE.slice(0, limit);
  }
}

export async function getAllDestinations(): Promise<DestinationListItem[]> {
  return fetchAllDestinations();
}

export async function searchDestinations(
  filters: DestinationCatalogFilters,
): Promise<DestinationListItem[]> {
  const destinations = await fetchAllDestinations();
  return filterDestinations(destinations, filters);
}

export async function getDestinationBySlug(
  slug: string,
): Promise<DestinationDetailResponse | null> {
  try {
    const response = await apiFetch<{ destination: DestinationDetailResponse }>(
      `/destinations/${slug}`,
    );
    return response.destination;
  } catch {
    const fallback = DESTINATIONS_FIXTURE.find((item) => item.slug === slug);
    if (!fallback) {
      return null;
    }

    return {
      id: fallback.id,
      slug: fallback.slug,
      title: fallback.title,
      country: fallback.country,
      region: fallback.region,
      heroImage: fallback.heroImage,
      gallery: [fallback.heroImage],
      overview: `${fallback.title} is a ${fallback.style.toLowerCase()} destination in ${fallback.country}.`,
      highlights: [fallback.category, fallback.style],
      climateNotes: null,
      currency: null,
      primaryLanguage: null,
      transportTips: null,
      budgetTier: fallback.budgetTier,
      bestTimeToVisit: null,
      categoryTags: [fallback.category],
      travelStyles: [fallback.style],
      rating: fallback.rating,
      reviewCount: fallback.popularity,
      isSaved: false,
      location: {
        country: fallback.country,
        region: fallback.region,
      },
      stays: [],
      experiences: [],
      relatedDestinations: [],
    };
  }
}

export type { DestinationDetailResponse };
