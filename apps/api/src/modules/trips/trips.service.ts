import { Prisma } from "../../generated/client.js";
import { logUserActivity } from "../../lib/activity.js";
import { AppError } from "../../lib/errors.js";
import { inferTimeSlot, parseTimeString } from "./trip-utils.js";
import {
  isItemNotInDayError,
  isItineraryOutOfRangeError,
  isTargetDayNotFoundError,
  tripsRepository,
} from "./trips.repository.js";
import type {
  CreateItineraryItemInput,
  CreateTripInput,
  TripStatusFilter,
  UpdateItineraryItemInput,
  UpdateTripInput,
} from "./trips.schemas.js";
import type { TripListItem } from "./trips.types.js";
import {
  resolveItineraryItemTitle,
  toTripDayItem,
  toTripDaySummary,
  toTripDayView,
  toTripDetail,
  toTripListItem,
} from "./trips.types.js";

function assertTripFound<T>(trip: T | null | undefined): T {
  if (!trip) {
    throw new AppError(404, "NOT_FOUND", "Trip not found.");
  }

  return trip;
}

function assertDayFound<T>(day: T | null | undefined): T {
  if (!day) {
    throw new AppError(404, "NOT_FOUND", "Trip day not found.");
  }

  return day;
}

function mapRepositoryError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022" || error.code === "P2028")
  ) {
    throw new AppError(
      503,
      "SCHEMA_OUT_OF_DATE",
      "Trip planning is temporarily unavailable. Run pnpm --filter @gowithus/api db:repair-schema, then try again.",
    );
  }

  if (error instanceof Error && error.message.includes("does not exist")) {
    throw new AppError(
      503,
      "SCHEMA_OUT_OF_DATE",
      "Trip planning is temporarily unavailable. Run pnpm --filter @gowithus/api db:repair-schema, then try again.",
    );
  }

  if (isItineraryOutOfRangeError(error)) {
    throw new AppError(
      409,
      "CONFLICT",
      "Trip dates cannot shrink while itinerary items exist on removed days.",
    );
  }

  if (isItemNotInDayError(error)) {
    throw new AppError(400, "VALIDATION_ERROR", "One or more items do not belong to this day.");
  }

  if (isTargetDayNotFoundError(error)) {
    throw new AppError(404, "NOT_FOUND", "Target day not found.");
  }

  throw error;
}

async function resolveItemPayload(input: CreateItineraryItemInput) {
  switch (input.type) {
    case "destination": {
      if (!input.destinationId) {
        throw new AppError(400, "VALIDATION_ERROR", "destinationId is required.");
      }

      const destination = await tripsRepository.findPublishedDestination(input.destinationId);
      if (!destination) {
        throw new AppError(404, "NOT_FOUND", "Destination not found.");
      }

      return {
        itemType: input.type,
        itemId: destination.id,
        title: await resolveItineraryItemTitle({
          itemType: input.type,
          itemId: destination.id,
          title: input.title,
          destination,
        }),
      };
    }
    case "stay": {
      if (!input.stayId) {
        throw new AppError(400, "VALIDATION_ERROR", "stayId is required.");
      }

      const stay = await tripsRepository.findPublishedStay(input.stayId);
      if (!stay) {
        throw new AppError(404, "NOT_FOUND", "Stay not found.");
      }

      return {
        itemType: input.type,
        itemId: stay.id,
        title: await resolveItineraryItemTitle({
          itemType: input.type,
          itemId: stay.id,
          title: input.title,
          stay,
        }),
      };
    }
    case "experience": {
      if (!input.experienceId) {
        throw new AppError(400, "VALIDATION_ERROR", "experienceId is required.");
      }

      const experience = await tripsRepository.findPublishedExperience(input.experienceId);
      if (!experience) {
        throw new AppError(404, "NOT_FOUND", "Experience not found.");
      }

      return {
        itemType: input.type,
        itemId: experience.id,
        title: await resolveItineraryItemTitle({
          itemType: input.type,
          itemId: experience.id,
          title: input.title,
          experience,
        }),
      };
    }
    case "restaurant": {
      if (!input.restaurantId) {
        throw new AppError(400, "VALIDATION_ERROR", "restaurantId is required.");
      }

      const restaurant = await tripsRepository.findPublishedRestaurant(input.restaurantId);
      if (!restaurant) {
        throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
      }

      return {
        itemType: input.type,
        itemId: restaurant.id,
        title: input.title?.trim() || restaurant.title,
      };
    }
    case "custom": {
      const title = input.title?.trim();
      if (!title) {
        throw new AppError(400, "VALIDATION_ERROR", "title is required.");
      }

      return {
        itemType: input.type,
        itemId: null,
        title,
      };
    }
  }
}

export const tripsService = {
  async listTrips(userId: string, status?: TripStatusFilter): Promise<TripListItem[]> {
    const trips = await tripsRepository.listTrips(userId, status);
    return trips.map(toTripListItem);
  },

  async createTrip(userId: string, input: CreateTripInput) {
    if (input.destinationId) {
      const destination = await tripsRepository.findPublishedDestination(input.destinationId);
      if (!destination) {
        throw new AppError(404, "NOT_FOUND", "Destination not found.");
      }
    }

    const trip = assertTripFound(
      await tripsRepository
        .createTrip({
          userId,
          title: input.title,
          destinationId: input.destinationId,
          startDate: input.startDate,
          endDate: input.endDate,
          description: input.description,
          coverImage: input.coverImage,
        })
        .catch(mapRepositoryError),
    );

    await logUserActivity({
      userId,
      type: "CREATED_TRIP",
      title: `Created trip: ${trip.title}`,
      metadata: { tripId: trip.id },
    }).catch(() => undefined);

    return toTripDetail({
      trip,
      days: trip.tripDays,
      items: trip.itineraryItems,
    });
  },

  async getTrip(userId: string, tripId: string) {
    const trip = assertTripFound(await tripsRepository.findOwnedTrip(userId, tripId));
    return toTripDetail({
      trip,
      days: trip.tripDays,
      items: trip.itineraryItems,
    });
  },

  async updateTrip(userId: string, tripId: string, input: UpdateTripInput) {
    const trip = assertTripFound(
      await tripsRepository.updateTrip(userId, tripId, input).catch(mapRepositoryError),
    );

    return toTripDetail({
      trip,
      days: trip.tripDays,
      items: trip.itineraryItems,
    });
  },

  async deleteTrip(userId: string, tripId: string) {
    const deleted = await tripsRepository.deleteTrip(userId, tripId);
    if (!deleted) {
      throw new AppError(404, "NOT_FOUND", "Trip not found.");
    }
  },

  async listDays(userId: string, tripId: string) {
    const days = await tripsRepository.listDays(userId, tripId);
    if (!days) {
      throw new AppError(404, "NOT_FOUND", "Trip not found.");
    }

    return days.map(({ day, itemCount }) => toTripDaySummary(day, itemCount));
  },

  async createDay(userId: string, tripId: string, title?: string) {
    const day = assertDayFound(await tripsRepository.createDay(userId, tripId, title));
    return toTripDaySummary(day, 0);
  },

  async updateDay(
    userId: string,
    tripId: string,
    dayId: string,
    input: { title?: string; dayDate?: string },
  ) {
    const day = assertDayFound(await tripsRepository.updateDay(userId, tripId, dayId, input));
    const trip = assertTripFound(await tripsRepository.findOwnedTrip(userId, tripId));
    const items = trip.itineraryItems.filter((item) => item.dayIndex === day.dayIndex);

    return toTripDayView(day, items);
  },

  async addItem(userId: string, tripId: string, dayId: string, input: CreateItineraryItemInput) {
    const day = assertDayFound(await tripsRepository.findOwnedDay(userId, tripId, dayId));
    const payload = await resolveItemPayload(input);
    const sortOrder =
      input.position ?? (await tripsRepository.getNextSortOrder(tripId, day.dayIndex));
    const startTime = input.startTime ?? "09:00";

    const item = await tripsRepository.createItineraryItem({
      tripId,
      dayIndex: day.dayIndex,
      dayDate: day.dayDate,
      itemType: payload.itemType,
      itemId: payload.itemId,
      title: payload.title,
      notes: input.notes,
      scheduledTime: parseTimeString(startTime),
      scheduledEndTime: input.endTime ? parseTimeString(input.endTime) : undefined,
      timeSlot: inferTimeSlot(startTime),
      sortOrder,
    });

    return toTripDayItem(item);
  },

  async updateItem(
    userId: string,
    tripId: string,
    dayId: string,
    itemId: string,
    input: UpdateItineraryItemInput,
  ) {
    const day = assertDayFound(await tripsRepository.findOwnedDay(userId, tripId, dayId));
    const existing = await tripsRepository.findOwnedItem(userId, tripId, itemId);

    if (!existing || existing.dayIndex !== day.dayIndex) {
      throw new AppError(404, "NOT_FOUND", "Itinerary item not found.");
    }

    const item = await tripsRepository.updateItineraryItem(userId, tripId, itemId, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.position !== undefined ? { sortOrder: input.position } : {}),
      ...(input.startTime !== undefined
        ? input.startTime
          ? {
              scheduledTime: parseTimeString(input.startTime),
              timeSlot: inferTimeSlot(input.startTime),
            }
          : { scheduledTime: null }
        : {}),
      ...(input.endTime !== undefined
        ? input.endTime
          ? { scheduledEndTime: parseTimeString(input.endTime) }
          : { scheduledEndTime: null }
        : {}),
    });

    if (!item) {
      throw new AppError(404, "NOT_FOUND", "Itinerary item not found.");
    }

    return toTripDayItem(item);
  },

  async deleteItem(userId: string, tripId: string, dayId: string, itemId: string) {
    const day = assertDayFound(await tripsRepository.findOwnedDay(userId, tripId, dayId));
    const existing = await tripsRepository.findOwnedItem(userId, tripId, itemId);

    if (!existing || existing.dayIndex !== day.dayIndex) {
      throw new AppError(404, "NOT_FOUND", "Itinerary item not found.");
    }

    const deleted = await tripsRepository.deleteItineraryItem(userId, tripId, itemId);
    if (!deleted) {
      throw new AppError(404, "NOT_FOUND", "Itinerary item not found.");
    }
  },

  async reorderItems(
    userId: string,
    tripId: string,
    dayId: string,
    items: Array<{ id: string; position: number }>,
  ) {
    const day = assertDayFound(await tripsRepository.findOwnedDay(userId, tripId, dayId));

    const result = await tripsRepository
      .reorderItems(userId, tripId, day.dayIndex, items)
      .catch(mapRepositoryError);

    if (!result) {
      throw new AppError(404, "NOT_FOUND", "Trip not found.");
    }

    const trip = assertTripFound(await tripsRepository.findOwnedTrip(userId, tripId));
    return toTripDayView(
      day,
      trip.itineraryItems.filter((item) => item.dayIndex === day.dayIndex),
    );
  },

  async moveItem(
    userId: string,
    tripId: string,
    itemId: string,
    input: { targetDayId: string; position: number },
  ) {
    const item = await tripsRepository
      .moveItem(userId, tripId, itemId, input.targetDayId, input.position)
      .catch(mapRepositoryError);

    if (!item) {
      throw new AppError(404, "NOT_FOUND", "Itinerary item not found.");
    }

    return toTripDayItem(item);
  },
};
