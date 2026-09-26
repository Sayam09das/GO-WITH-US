import type { TripSummary } from "@gowithus/types";
import {
  countTripNights,
  formatTripDateRange,
  tripCoverImage,
  tripDestinationLabel,
  tripDestinationTitle,
} from "@/lib/account/trips/trip-display";
import type { ItinerariesTabId } from "./itineraries-copy";

export function partitionItinerariesByTab(
  trips: TripSummary[],
): Record<ItinerariesTabId, TripSummary[]> {
  return {
    upcoming: trips.filter((trip) => trip.status === "upcoming" || trip.status === "active"),
    drafts: trips.filter((trip) => trip.status === "draft"),
    past: trips.filter((trip) => trip.status === "completed"),
  };
}

export function countTripDays(startDate: string | null, endDate: string | null): number | null {
  const nights = countTripNights(startDate, endDate);
  if (nights == null) {
    return null;
  }
  return nights + 1;
}

export function itineraryProgress(trip: TripSummary): number {
  const days = countTripDays(trip.startDate, trip.endDate) ?? 4;
  const items = trip.itemCount ?? 0;
  const target = Math.max(days * 2, 4);
  return Math.min(100, Math.round((items / target) * 100));
}

export function itineraryProgressLabel(trip: TripSummary): string {
  if (trip.status === "draft") {
    return "Draft";
  }
  if ((trip.itemCount ?? 0) === 0) {
    return "Planning";
  }
  if (itineraryProgress(trip) >= 80) {
    return "Almost ready";
  }
  return "Planning";
}

export function itineraryPlannedLabel(trip: TripSummary): string {
  const count = trip.itemCount ?? 0;
  return count === 1 ? "1 place planned" : `${count} places planned`;
}

export function itineraryDaysLabel(trip: TripSummary): string {
  const days = countTripDays(trip.startDate, trip.endDate);
  if (!days) {
    return "Dates flexible";
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function itineraryHref(tripId: string): string {
  return `/account/itineraries/${tripId}`;
}

export { formatTripDateRange, tripCoverImage, tripDestinationLabel, tripDestinationTitle };
