import type { DestinationCatalogFilters, DestinationListItem } from "@/types/destination";

function matchesQuery(destination: DestinationListItem, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = [
    destination.title,
    destination.location,
    destination.country,
    destination.region,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function sortDestinations(
  items: DestinationListItem[],
  sort: DestinationCatalogFilters["sort"],
): DestinationListItem[] {
  const sorted = [...items];

  switch (sort) {
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted.sort((a, b) => b.popularity - a.popularity);
  }
}

export function filterDestinations(
  items: DestinationListItem[],
  filters: DestinationCatalogFilters,
): DestinationListItem[] {
  const minRating = filters.rating ? Number.parseFloat(filters.rating) : null;

  const filtered = items.filter((destination) => {
    if (!matchesQuery(destination, filters.q)) {
      return false;
    }
    if (filters.region && destination.region !== filters.region) {
      return false;
    }
    if (filters.style && destination.style !== filters.style) {
      return false;
    }
    if (filters.budgetTier && destination.budgetTier !== filters.budgetTier) {
      return false;
    }
    if (minRating !== null && destination.rating < minRating) {
      return false;
    }
    return true;
  });

  return sortDestinations(filtered, filters.sort);
}

export function getDestinationFilterOptions(items: DestinationListItem[]) {
  const regions = [...new Set(items.map((item) => item.region))].sort();
  const styles = [...new Set(items.map((item) => item.style))].sort();

  return { regions, styles };
}
