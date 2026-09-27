import type { DestinationListItem as ApiDestinationListItem } from "@gowithus/types";
import { filterDestinations } from "@/lib/destinations/catalog/filter";
import { POPULAR_DESTINATIONS_HOMEPAGE_SHOWCASE } from "@/lib/landing/popular-destinations";
import type { DestinationCatalogFilters, DestinationListItem } from "@/types/destination";
import { apiFetch } from "./client";
import { mapDestinationListItem } from "./mappers";

type DestinationListResponse = {
  destinations: ApiDestinationListItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type DestinationFetch = typeof apiFetch;

async function fetchAllDestinations(
  fetcher: DestinationFetch = apiFetch,
): Promise<DestinationListItem[]> {
  const merged = new Map<string, DestinationListItem>();

  try {
    const featured = await fetcher<DestinationListResponse>("/destinations/featured");
    for (const item of featured.destinations) {
      merged.set(item.slug, mapDestinationListItem(item));
    }
  } catch {
    // Featured list is optional; paginated catalog is the source of truth.
  }

  const limit = 100;
  let page = 1;
  let totalPages = 1;

  do {
    try {
      const listed = await fetcher<DestinationListResponse>(
        `/destinations?limit=${limit}&page=${page}&sort=popular`,
      );

      for (const item of listed.destinations) {
        merged.set(item.slug, mapDestinationListItem(item));
      }

      totalPages = listed.meta?.totalPages ?? 1;
      page += 1;
    } catch {
      break;
    }
  } while (page <= totalPages);

  return [...merged.values()];
}

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
      `/destinations?limit=${limit}&page=1&sort=popular`,
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

export async function getAllDestinations(
  fetcher: DestinationFetch = apiFetch,
): Promise<DestinationListItem[]> {
  try {
    const merged = await fetchAllDestinations(fetcher);
    if (merged.length > 0) {
      return merged;
    }
  } catch {
    // Fall through when the catalog API is unreachable.
  }

  return POPULAR_DESTINATIONS_HOMEPAGE_SHOWCASE;
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
