import type { TripSummary } from "@gowithus/types";
import { apiFetch } from "./client";

type TripListResponse = { items: TripSummary[] };

export async function listTrips(
  status?: TripSummary["status"] | "upcoming",
): Promise<TripSummary[]> {
  const query = status ? `?status=${status}` : "";

  try {
    const response = await apiFetch<TripListResponse>(`/trips${query}`);
    return response.items;
  } catch {
    return [];
  }
}

export async function createTrip(input: {
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TripSummary> {
  const response = await apiFetch<{ trip: TripSummary }>("/trips", {
    method: "POST",
    body: input,
  });
  return response.trip;
}
