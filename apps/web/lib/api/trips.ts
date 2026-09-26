import type { TripSummary } from "@gowithus/types";
import { mapTripSummaryFromDetail } from "@/lib/api/trip-mappers";
import { notifyNavCountsChanged } from "@/lib/navigation/nav-counts-events";
import { apiFetch } from "./client";

type TripListResponse = { items: TripSummary[] };

export async function listTrips(
  status?: TripSummary["status"] | "upcoming",
): Promise<TripSummary[]> {
  const query = status ? `?status=${status}` : "";

  const response = await apiFetch<TripListResponse>(`/trips${query}`);
  return response.items;
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
