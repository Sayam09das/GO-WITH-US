import { DESTINATIONS_FIXTURE } from "@/data/fixtures/loaders/destinations";
import type { DestinationListItem } from "@/types/destination";

/** Homepage destination grid — JSON fixture-backed until REST is wired. */
export function getPopularDestinations(limit = 6): DestinationListItem[] {
  return DESTINATIONS_FIXTURE.slice(0, limit);
}

export function getDestinationBySlug(slug: string): DestinationListItem | undefined {
  return DESTINATIONS_FIXTURE.find((item) => item.slug === slug);
}
