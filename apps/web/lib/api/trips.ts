import type { TripSummary } from "@gowithus/types";
import { mapTripSummaryFromDetail } from "@/lib/api/trip-mappers";
import { notifyNavCountsChanged } from "@/lib/navigation/nav-counts-events";
import { apiFetch } from "./client";

type TripListResponse = { items: TripSummary[] };

export type TripListStatusFilter = TripSummary["status"] | "upcoming" | "past" | "ongoing";

type TripDetailDayItem = {
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

type TripDetailDay = {
  id: string;
  dayIndex: number;
  title: string;
  items: TripDetailDayItem[];
};

type TripDetailResponse = {
  id: string;
  title: string;
  description: string | null;
  destination: { title: string; country: string } | null;
  startDate: string | null;
  endDate: string | null;
  days: TripDetailDay[];
};

export async function listTrips(status?: TripListStatusFilter): Promise<TripSummary[]> {
  const query = status ? `?status=${status}` : "";

  const response = await apiFetch<TripListResponse>(`/trips${query}`);
  return response.items;
}

export async function getTrip(tripId: string): Promise<TripDetailResponse> {
  const response = await apiFetch<{ trip: TripDetailResponse }>(`/trips/${tripId}`);
  return response.trip;
}

export type { TripDetailDay, TripDetailDayItem, TripDetailResponse };

export type UpdateItineraryItemInput = {
  title?: string;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  position?: number;
};

export async function updateItineraryItem(
  tripId: string,
  dayId: string,
  itemId: string,
  input: UpdateItineraryItemInput,
): Promise<void> {
  await apiFetch(`/trips/${tripId}/days/${dayId}/items/${itemId}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteItineraryItem(
  tripId: string,
  dayId: string,
  itemId: string,
): Promise<void> {
  await apiFetch(`/trips/${tripId}/days/${dayId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function reorderItineraryItems(
  tripId: string,
  dayId: string,
  items: Array<{ id: string; position: number }>,
): Promise<void> {
  await apiFetch(`/trips/${tripId}/days/${dayId}/items/reorder`, {
    method: "PATCH",
    body: { items },
  });
}

export async function moveItineraryItem(
  tripId: string,
  itemId: string,
  input: { targetDayId: string; position: number },
): Promise<void> {
  await apiFetch(`/trips/${tripId}/items/${itemId}/move`, {
    method: "PATCH",
    body: input,
  });
}

export type UpdateTripInput = {
  title?: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export async function updateTrip(tripId: string, input: UpdateTripInput): Promise<void> {
  await apiFetch(`/trips/${tripId}`, {
    method: "PATCH",
    body: input,
  });
  notifyNavCountsChanged();
}

export type CreateItineraryItemInput = {
  type: "destination" | "stay" | "experience" | "restaurant" | "custom";
  destinationId?: string;
  stayId?: string;
  experienceId?: string;
  restaurantId?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
};

export async function createTripDay(
  tripId: string,
  title?: string,
): Promise<{ id: string; dayIndex: number }> {
  const response = await apiFetch<{ day: { id: string; dayIndex: number } }>(
    `/trips/${tripId}/days`,
    {
      method: "POST",
      body: title ? { title } : {},
    },
  );
  return response.day;
}

export async function addItineraryItem(
  tripId: string,
  dayId: string,
  input: CreateItineraryItemInput,
): Promise<void> {
  await apiFetch(`/trips/${tripId}/days/${dayId}/items`, {
    method: "POST",
    body: input,
  });
}

export async function createTrip(input: {
  title: string;
  destinationId?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}): Promise<TripSummary> {
  const response = await apiFetch<{ trip: Parameters<typeof mapTripSummaryFromDetail>[0] }>(
    "/trips",
    {
      method: "POST",
      body: {
        title: input.title,
        destinationId: input.destinationId,
        startDate: input.startDate,
        endDate: input.endDate,
        description: input.description,
      },
    },
  );
  notifyNavCountsChanged();
  return mapTripSummaryFromDetail(response.trip);
}
