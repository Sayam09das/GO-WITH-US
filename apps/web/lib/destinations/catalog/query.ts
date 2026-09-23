import type { DestinationCatalogFilters, DestinationSort } from "@/types/destination";

const SORT_VALUES: DestinationSort[] = ["popularity", "name", "rating"];

function parseSort(value: string | null): DestinationSort {
  if (value && SORT_VALUES.includes(value as DestinationSort)) {
    return value as DestinationSort;
  }
  return "popularity";
}

export function parseDestinationCatalogFilters(
  searchParams: URLSearchParams,
): DestinationCatalogFilters {
  return {
    q: searchParams.get("q")?.trim() ?? "",
    region: searchParams.get("region") ?? "",
    style: searchParams.get("style") ?? "",
    budgetTier: searchParams.get("budget") ?? "",
    rating: searchParams.get("rating") ?? "",
    sort: parseSort(searchParams.get("sort")),
  };
}

export function buildDestinationCatalogSearchParams(
  filters: DestinationCatalogFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.region) {
    params.set("region", filters.region);
  }
  if (filters.style) {
    params.set("style", filters.style);
  }
  if (filters.budgetTier) {
    params.set("budget", filters.budgetTier);
  }
  if (filters.rating) {
    params.set("rating", filters.rating);
  }
  if (filters.sort !== "popularity") {
    params.set("sort", filters.sort);
  }

  return params;
}

export function hasActiveDestinationFilters(filters: DestinationCatalogFilters): boolean {
  return Boolean(
    filters.q || filters.region || filters.style || filters.budgetTier || filters.rating,
  );
}
