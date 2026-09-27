import type {
  Destination,
  Experience,
  ItineraryItem,
  Stay,
  Trip,
  TripDay,
  TripStatus,
} from "@prisma/client";
import { formatDateOnly, formatTimeString } from "./trip-utils.js";

export type TripListItem = {
  id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  status: TripStatus;
  itemCount: number;
};

export type TripDayItem = {
  id: string;
  type: string;
  itemId: string | null;
  title: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  position: number;
  timeSlot: string;
};

export type TripDayView = {
  id: string;
  dayIndex: number;
  date: string | null;
  title: string;
  items: TripDayItem[];
};

export type TripDetail = {
  id: string;
  title: string;
  description: string | null;
  destination: {
    id: string;
    slug: string;
    title: string;
    country: string;
    region: string;
  } | null;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  status: TripStatus;
  totalDays: number;
  plannedItemCount: number;
  days: TripDayView[];
};

export type TripDaySummary = {
  id: string;
  dayIndex: number;
  date: string | null;
  title: string;
  itemCount: number;
};

function defaultDayTitle(dayIndex: number, title: string | null | undefined): string {
  return title?.trim() || `Day ${dayIndex}`;
}

export function toTripListItem(
  trip: Trip & {
    destination: Destination | null;
    _count: { itineraryItems: number };
  },
): TripListItem {
  return {
    id: trip.id,
    title: trip.title,
    destination: trip.destination ? `${trip.destination.title}, ${trip.destination.country}` : null,
    startDate: trip.startDate ? formatDateOnly(trip.startDate) : null,
    endDate: trip.endDate ? formatDateOnly(trip.endDate) : null,
    coverImage: trip.coverImage ?? trip.destination?.heroImage ?? null,
    status: trip.status,
    itemCount: trip._count.itineraryItems,
  };
}

export function toTripDayItem(item: ItineraryItem): TripDayItem {
  return {
    id: item.id,
    type: item.itemType,
    itemId: item.itemId,
    title: item.title,
    startTime: formatTimeString(item.scheduledTime),
    endTime: formatTimeString(item.scheduledEndTime),
    notes: item.notes,
    position: item.sortOrder,
    timeSlot: item.timeSlot,
  };
}

export function toTripDayView(day: TripDay, items: ItineraryItem[]): TripDayView {
  return {
    id: day.id,
    dayIndex: day.dayIndex,
    date: day.dayDate ? formatDateOnly(day.dayDate) : null,
    title: defaultDayTitle(day.dayIndex, day.title),
    items: items
      .filter((item) => item.dayIndex === day.dayIndex)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(toTripDayItem),
  };
}

export function toTripDaySummary(day: TripDay, itemCount: number): TripDaySummary {
  return {
    id: day.id,
    dayIndex: day.dayIndex,
    date: day.dayDate ? formatDateOnly(day.dayDate) : null,
    title: defaultDayTitle(day.dayIndex, day.title),
    itemCount,
  };
}

export function toTripDetail(input: {
  trip: Trip & { destination: Destination | null };
  days: TripDay[];
  items: ItineraryItem[];
}): TripDetail {
  const dayViews = input.days
    .sort((left, right) => left.dayIndex - right.dayIndex)
    .map((day) => toTripDayView(day, input.items));

  return {
    id: input.trip.id,
    title: input.trip.title,
    description: input.trip.description,
    destination: input.trip.destination
      ? {
          id: input.trip.destination.id,
          slug: input.trip.destination.slug,
          title: input.trip.destination.title,
          country: input.trip.destination.country,
          region: input.trip.destination.region,
        }
      : null,
    startDate: input.trip.startDate ? formatDateOnly(input.trip.startDate) : null,
    endDate: input.trip.endDate ? formatDateOnly(input.trip.endDate) : null,
    coverImage: input.trip.coverImage ?? input.trip.destination?.heroImage ?? null,
    status: input.trip.status,
    totalDays: input.days.length,
    plannedItemCount: input.items.length,
    days: dayViews,
  };
}

export async function resolveItineraryItemTitle(input: {
  itemType: ItineraryItem["itemType"];
  itemId: string | null;
  title?: string;
  destination?: Pick<Destination, "title"> | null;
  stay?: Pick<Stay, "title"> | null;
  experience?: Pick<Experience, "title"> | null;
}): Promise<string> {
  if (input.title?.trim()) {
    return input.title.trim();
  }

  if (input.destination?.title) {
    return input.destination.title;
  }

  if (input.stay?.title) {
    return input.stay.title;
  }

  if (input.experience?.title) {
    return input.experience.title;
  }

  return "Planned activity";
}
