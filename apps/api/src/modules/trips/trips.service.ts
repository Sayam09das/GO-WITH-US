import type { TripStatus } from "../../generated/client.js";
import { usersRepository } from "../users/users.repository.js";

export type TripSummary = {
  id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  status: TripStatus;
};

export const tripsService = {
  async listTrips(userId: string, status?: TripStatus): Promise<TripSummary[]> {
    const trips = await usersRepository.listTrips(userId, status);

    return trips.map((trip) => ({
      id: trip.id,
      title: trip.title,
      destination: trip.destination
        ? `${trip.destination.title}, ${trip.destination.country}`
        : null,
      startDate: trip.startDate?.toISOString().slice(0, 10) ?? null,
      endDate: trip.endDate?.toISOString().slice(0, 10) ?? null,
      coverImage: trip.coverImage ?? trip.destination?.heroImage ?? null,
      status: trip.status,
    }));
  },
};
