import type { DestinationListItem as ApiDestinationListItem } from "@gowithus/types";
import { filterDestinations } from "@/lib/destinations/catalog/filter";
import { POPULAR_DESTINATIONS_HOMEPAGE_SHOWCASE } from "@/lib/landing/popular-destinations";
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
  const featured = await apiFetch<DestinationListResponse>("/destinations/featured");
  const listed = await apiFetch<DestinationListResponse>("/destinations?limit=100&page=1");

  const merged = new Map<string, DestinationListItem>();
  for (const item of [...featured.destinations, ...listed.destinations]) {
    merged.set(item.slug, mapDestinationListItem(item));
  }

  return [...merged.values()];
}

async function fetchPopularFromApi(limit: number): Promise<DestinationListItem[]> {
  try {
    const response = await apiFetch<DestinationListResponse>("/destinations/featured");
    const featured = response.destinations.slice(0, limit).map(mapDestinationListItem);
    if (featured.length > 0) {
      return featured;
    }
  } catch {
    // Fall through to catalog list.
  }

  try {
    const listed = await apiFetch<DestinationListResponse>(
      `/destinations?limit=${limit}&page=1&sort=popularity`,
    );
    if (listed.destinations.length > 0) {
      return listed.destinations.map(mapDestinationListItem);
    }
  } catch {
    // Fall through to homepage showcase.
  }

  try {
    const all = await fetchAllDestinations();
    if (all.length > 0) {
      return all.slice(0, limit);
    }
  } catch {
    // Fall through to homepage showcase.
  }

  return [];
}

export async function getPopularDestinations(limit = 6): Promise<DestinationListItem[]> {
  const fromApi = await fetchPopularFromApi(limit);
  if (fromApi.length > 0) {
    return fromApi;
  }

  return POPULAR_DESTINATIONS_HOMEPAGE_SHOWCASE.slice(0, limit);
}

export async function getAllDestinations(): Promise<DestinationListItem[]> {
  return fetchAllDestinations();
}

export async function searchDestinations(
  filters: DestinationCatalogFilters,
): Promise<DestinationListItem[]> {
  if (filters.q.trim()) {
    const response = await apiFetch<DestinationListResponse>("/destinations/search", {
      method: "POST",
      body: {
        query: filters.q,
        page: 1,
        limit: 100,
        sort: filters.sort === "name" ? "name" : filters.sort === "rating" ? "rating" : "popular",
      },
    });
    const mapped = response.destinations.map(mapDestinationListItem);
    return filterDestinations(mapped, { ...filters, q: "" });
  }

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
    return null;
  }
}

export type { DestinationDetailResponse };
