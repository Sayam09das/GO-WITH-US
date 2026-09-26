import type { TripSummary } from "@gowithus/types";
import type { MyTripsTabId } from "./my-trips-copy";

const UPCOMING_STATUSES: TripSummary["status"][] = ["draft", "upcoming", "active"];

export function partitionTripsByTab(trips: TripSummary[]): Record<MyTripsTabId, TripSummary[]> {
  return {
    upcoming: trips.filter((trip) => UPCOMING_STATUSES.includes(trip.status)),
    past: trips.filter((trip) => trip.status === "completed"),
    cancelled: trips.filter((trip) => trip.status === "cancelled"),
  };
}

export function tripDestinationTitle(trip: TripSummary): string {
  if (trip.destination?.trim()) {
    return trip.destination;
  }

  return trip.title;
}

export function tripDestinationLabel(trip: TripSummary): string {
  return tripDestinationTitle(trip).toUpperCase();
}

export function countTripNights(startDate: string | null, endDate: string | null): number | null {
  if (!startDate || !endDate) {
    return null;
  }

  const startMs = Date.parse(`${startDate}T00:00:00.000Z`);
  const endMs = Date.parse(`${endDate}T00:00:00.000Z`);
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) {
    return null;
  }

  const nights = Math.round((endMs - startMs) / 86_400_000);
  return Math.max(nights, 1);
}

function formatDayMonth(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString(undefined, options);
}

export function formatTripDateRange(
  startDate: string | null,
  endDate: string | null,
  style: "long" | "compact" = "long",
): string {
  if (!startDate) {
    return "Dates to be confirmed";
  }

  const monthStyle: Intl.DateTimeFormatOptions =
    style === "long"
      ? { day: "numeric", month: "long", year: "numeric" }
      : { day: "numeric", month: "short", year: "numeric" };

  const startDay = formatDayMonth(startDate, { day: "numeric" });
  const endFormatted = formatDayMonth(endDate ?? startDate, monthStyle);

  if (!endDate || endDate === startDate) {
    return endFormatted;
  }

  const endDay = formatDayMonth(endDate, { day: "numeric" });
  const sharedMonth = startDate.slice(0, 7) === endDate.slice(0, 7);

  if (sharedMonth && style === "long") {
    const monthYear = formatDayMonth(startDate, { month: "long", year: "numeric" });
    return `${startDay} — ${endDay} ${monthYear}`;
  }

  if (sharedMonth && style === "compact") {
    const monthYear = formatDayMonth(startDate, { month: "short", year: "numeric" });
    return `${startDay} — ${endDay} ${monthYear}`;
  }

  const startFormatted = formatDayMonth(startDate, monthStyle);
  return `${startFormatted} — ${endFormatted}`;
}

export function formatTripMetaLine(trip: TripSummary): string {
  const nights = countTripNights(trip.startDate, trip.endDate);
  const nightsLabel = nights ? `${nights} night${nights === 1 ? "" : "s"}` : "Dates flexible";

  if (trip.status === "draft") {
    return `${nightsLabel} · Draft in progress`;
  }

  return `${nightsLabel} · 2 travelers`;
}

export function tripStatusLabel(status: TripSummary["status"]): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "upcoming":
    case "active":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Confirmed";
  }
}

export function tripCoverImage(trip: TripSummary): string {
  return trip.coverImage ?? "/landingImg/travelimg/travel-5.jpg";
}

export function tripItineraryHref(tripId: string): string {
  return `/account/itineraries/${tripId}`;
}

export function tripViewHref(tripId: string): string {
  return `/account/itineraries/${tripId}`;
}

export type TripIncludesCounts = {
  stay: number;
  experience: number;
  restaurant: number;
  places: number;
};

export function buildTripIncludesFromItemTypes(types: string[]): TripIncludesCounts {
  const counts: TripIncludesCounts = {
    stay: 0,
    experience: 0,
    restaurant: 0,
    places: 0,
  };

  for (const type of types) {
    if (type === "stay") {
      counts.stay += 1;
    } else if (type === "experience") {
      counts.experience += 1;
    } else if (type === "restaurant") {
      counts.restaurant += 1;
    } else if (type === "place" || type === "destination") {
      counts.places += 1;
    }
  }

  return counts;
}
