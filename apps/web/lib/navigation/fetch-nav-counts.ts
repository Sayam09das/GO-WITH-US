import { ApiRequestError } from "@/lib/api/client";
import { listTrips } from "@/lib/api/trips";
import { listSavedDestinations, listSavedExperiences, listSavedStays } from "@/lib/api/users";

export type NavCounts = {
  saved: number;
  trips: number;
};

export const EMPTY_NAV_COUNTS: NavCounts = { saved: 0, trips: 0 };

export async function fetchNavCounts(): Promise<NavCounts> {
  try {
    const [destinations, stays, experiences, trips] = await Promise.all([
      listSavedDestinations(),
      listSavedStays(),
      listSavedExperiences(),
      listTrips(),
    ]);

    return {
      saved: destinations.length + stays.length + experiences.length,
      trips: trips.length,
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      return EMPTY_NAV_COUNTS;
    }

    throw error;
  }
}

export function navCountForHref(href: string, counts: NavCounts): number {
  if (href === "/saved") {
    return counts.saved;
  }

  if (href === "/trips") {
    return counts.trips;
  }

  return 0;
}
