import type { TripSummary } from "@gowithus/types";
import { mapTripSummaryFromDetail } from "@/lib/api/trip-mappers";
import { notifyNavCountsChanged } from "@/lib/navigation/nav-counts-events";
import { apiFetch } from "./client";

type TripListResponse = { items: TripSummary[] };

export type TripListStatusFilter = TripSummary["status"] | "upcoming" | "past" | "ongoing";

type TripDetailDayItem = {
  id: string;
  type: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
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

export type { TripDetailResponse };

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
