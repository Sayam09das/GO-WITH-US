import type { TripSummary } from "@gowithus/types";

type TripDetailLike = {
  id: string;
  title: string;
  destination?: { title: string; country: string } | null;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  status: TripSummary["status"];
  plannedItemCount?: number;
  itemCount?: number;
};

export function mapTripSummaryFromDetail(trip: TripDetailLike): TripSummary {
  return {
    id: trip.id,
    title: trip.title,
    destination: trip.destination ? `${trip.destination.title}, ${trip.destination.country}` : null,
    startDate: trip.startDate,
    endDate: trip.endDate,
    coverImage: trip.coverImage,
    status: trip.status,
    itemCount: trip.itemCount ?? trip.plannedItemCount ?? 0,
  };
}
