import { DESTINATIONS_FIXTURE } from "@/data/fixtures/loaders/destinations";
import { filterDestinations } from "@/lib/destinations/catalog/filter";
import type { DestinationCatalogFilters, DestinationListItem } from "@/types/destination";

/** Homepage destination grid — JSON fixture-backed until REST is wired. */
export function getPopularDestinations(limit = 6): DestinationListItem[] {
  return DESTINATIONS_FIXTURE.slice(0, limit);
}

export function getAllDestinations(): DestinationListItem[] {
  return DESTINATIONS_FIXTURE;
}

export function searchDestinations(filters: DestinationCatalogFilters): DestinationListItem[] {
  return filterDestinations(DESTINATIONS_FIXTURE, filters);
}

export function getDestinationBySlug(slug: string): DestinationListItem | undefined {
  return DESTINATIONS_FIXTURE.find((item) => item.slug === slug);
}
