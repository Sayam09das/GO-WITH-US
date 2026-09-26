import type { ItineraryItemType, Prisma, TripStatus } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import {
  addDaysToDate,
  computeTripStatus,
  countTripDays,
  shouldPersistStatus,
} from "./trip-utils.js";
import type { TripStatusFilter } from "./trips.schemas.js";

const tripInclude = {
  destination: true,
  tripDays: { orderBy: { dayIndex: "asc" as const } },
  itineraryItems: { orderBy: [{ dayIndex: "asc" as const }, { sortOrder: "asc" as const }] },
} satisfies Prisma.TripInclude;

function buildTripListWhere(userId: string, status?: TripStatusFilter): Prisma.TripWhereInput {
  if (!status) {
    return { userId };
  }

  if (status === "past") {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return {
      userId,
      OR: [{ status: "completed" }, { endDate: { lt: today }, status: { not: "cancelled" } }],
    };
  }

  const mappedStatus = status === "ongoing" ? "active" : status;
  return { userId, status: mappedStatus };
}

async function syncTripDays(
  db: Pick<Prisma.TransactionClient, "tripDay" | "itineraryItem">,
  tripId: string,
  startDate: Date,
  endDate: Date,
) {
  const dayCount = countTripDays(startDate, endDate);
  const existingDays = await db.tripDay.findMany({
    where: { tripId },
    orderBy: { dayIndex: "asc" },
  });

  const itemsOutsideRange = await db.itineraryItem.findFirst({
    where: {
      tripId,
      dayIndex: { gt: dayCount },
    },
    select: { id: true },
  });

  if (itemsOutsideRange) {
    throw new Error("ITINERARY_OUT_OF_RANGE");
  }

  for (let dayIndex = 1; dayIndex <= dayCount; dayIndex += 1) {
    const dayDate = addDaysToDate(startDate, dayIndex - 1);
    const existing = existingDays.find((day) => day.dayIndex === dayIndex);

    if (existing) {
      await db.tripDay.update({
        where: { id: existing.id },
        data: { dayDate },
      });
      await db.itineraryItem.updateMany({
        where: { tripId, dayIndex },
        data: { dayDate },
      });
      continue;
    }

    await db.tripDay.create({
      data: {
        tripId,
        dayIndex,
        dayDate,
        title: `Day ${dayIndex}`,
      },
    });
  }

  if (existingDays.length > dayCount) {
    await db.tripDay.deleteMany({
      where: {
        tripId,
        dayIndex: { gt: dayCount },
      },
    });
  }
}

async function refreshTripStatus(db: Pick<Prisma.TransactionClient, "trip">, tripId: string) {
  const trip = await db.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    return null;
  }

  const computedStatus = computeTripStatus(trip);
  if (shouldPersistStatus(trip.status, computedStatus)) {
    return db.trip.update({
      where: { id: tripId },
      data: { status: computedStatus },
      include: tripInclude,
    });
  }

  return db.trip.findUnique({
    where: { id: tripId },
    include: tripInclude,
  });
}

export const tripsRepository = {
  async findOwnedTrip(userId: string, tripId: string) {
    return prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: tripInclude,
    });
  },

  async listTrips(userId: string, status?: TripStatusFilter) {
    const trips = await prisma.trip.findMany({
      where: buildTripListWhere(userId, status),
      include: {
        destination: true,
        _count: { select: { itineraryItems: true } },
      },
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    });

    const refreshed = await Promise.all(
      trips.map(async (trip) => {
        const computedStatus = computeTripStatus(trip);
        if (shouldPersistStatus(trip.status, computedStatus)) {
          return prisma.trip.update({
            where: { id: trip.id },
            data: { status: computedStatus },
            include: {
              destination: true,
              _count: { select: { itineraryItems: true } },
            },
          });
        }

        return trip;
      }),
    );

    return refreshed;
  },

  async createTrip(input: {
    userId: string;
    title: string;
    destinationId?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    coverImage?: string;
  }) {
    const startDate = input.startDate ? new Date(`${input.startDate}T00:00:00.000Z`) : null;
    const endDate = input.endDate ? new Date(`${input.endDate}T00:00:00.000Z`) : null;
    const status = computeTripStatus({
      status: "draft",
      startDate,
      endDate,
    });

    const trip = await prisma.trip.create({
      data: {
        userId: input.userId,
        title: input.title,
        destinationId: input.destinationId,
        startDate,
        endDate,
        description: input.description,
        coverImage: input.coverImage,
        status,
      },
      include: tripInclude,
    });

    if (startDate && endDate) {
      await syncTripDays(prisma, trip.id, startDate, endDate);
    }

    const refreshed = await refreshTripStatus(prisma, trip.id);
    return refreshed ?? trip;
  },

  async updateTrip(
    userId: string,
    tripId: string,
    input: {
      title?: string;
      description?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      coverImage?: string | null;
      status?: TripStatus;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.trip.findFirst({
        where: { id: tripId, userId },
        include: tripInclude,
      });

      if (!existing) {
        return null;
      }

      const startDate =
        input.startDate === undefined
          ? existing.startDate
          : input.startDate
            ? new Date(`${input.startDate}T00:00:00.000Z`)
            : null;
      const endDate =
        input.endDate === undefined
          ? existing.endDate
          : input.endDate
            ? new Date(`${input.endDate}T00:00:00.000Z`)
            : null;

      const baseStatus = existing.status === "cancelled" ? "cancelled" : "draft";
      const nextStatus =
        input.status ??
        computeTripStatus({
          status: baseStatus,
          startDate,
          endDate,
        });

      await tx.trip.update({
        where: { id: tripId },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
          ...(input.startDate !== undefined ? { startDate } : {}),
          ...(input.endDate !== undefined ? { endDate } : {}),
          status: input.status ?? nextStatus,
        },
      });

      if (startDate && endDate) {
        await syncTripDays(tx, tripId, startDate, endDate);
      }

      return refreshTripStatus(tx, tripId);
    });
  },

  async deleteTrip(userId: string, tripId: string) {
    const result = await prisma.trip.deleteMany({
      where: { id: tripId, userId },
    });

    return result.count > 0;
  },

  async findOwnedDay(userId: string, tripId: string, dayId: string) {
    return prisma.tripDay.findFirst({
      where: {
        id: dayId,
        tripId,
        trip: { userId },
      },
    });
  },

  async listDays(userId: string, tripId: string) {
    const trip = await this.findOwnedTrip(userId, tripId);
    if (!trip) {
      return null;
    }

    const itemCounts = await prisma.itineraryItem.groupBy({
      by: ["dayIndex"],
      where: { tripId },
      _count: { _all: true },
    });
    const countMap = new Map(itemCounts.map((entry) => [entry.dayIndex, entry._count._all]));

    return trip.tripDays.map((day) => ({
      day,
      itemCount: countMap.get(day.dayIndex) ?? 0,
    }));
  },

  async createDay(userId: string, tripId: string, title?: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({
        where: { id: tripId, userId },
        include: { tripDays: { orderBy: { dayIndex: "desc" }, take: 1 } },
      });

      if (!trip) {
        return null;
      }

      const nextIndex = (trip.tripDays[0]?.dayIndex ?? 0) + 1;
      const nextDate =
        trip.startDate && trip.endDate ? addDaysToDate(trip.startDate, nextIndex - 1) : null;
      const nextEndDate = nextDate ?? undefined;

      const day = await tx.tripDay.create({
        data: {
          tripId,
          dayIndex: nextIndex,
          dayDate: nextDate,
          title: title ?? `Day ${nextIndex}`,
        },
      });

      if (trip.endDate && nextEndDate && nextEndDate > trip.endDate) {
        await tx.trip.update({
          where: { id: tripId },
          data: { endDate: nextEndDate },
        });
      }

      return day;
    });
  },

  async updateDay(
    userId: string,
    tripId: string,
    dayId: string,
    input: { title?: string; dayDate?: string },
  ) {
    const day = await this.findOwnedDay(userId, tripId, dayId);
    if (!day) {
      return null;
    }

    const dayDate = input.dayDate ? new Date(`${input.dayDate}T00:00:00.000Z`) : undefined;

    const updated = await prisma.tripDay.update({
      where: { id: dayId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(dayDate ? { dayDate } : {}),
      },
    });

    if (dayDate) {
      await prisma.itineraryItem.updateMany({
        where: { tripId, dayIndex: day.dayIndex },
        data: { dayDate },
      });
    }

    return updated;
  },

  async findPublishedDestination(id: string) {
    return prisma.destination.findFirst({ where: { id, isPublished: true } });
  },

  async findPublishedStay(id: string) {
    return prisma.stay.findFirst({ where: { id, isPublished: true } });
  },

  async findPublishedExperience(id: string) {
    return prisma.experience.findFirst({ where: { id, isPublished: true } });
  },

  async findPublishedRestaurant(id: string) {
    return prisma.restaurant.findFirst({ where: { id, isPublished: true } });
  },

  async getNextSortOrder(tripId: string, dayIndex: number) {
    const lastItem = await prisma.itineraryItem.findFirst({
      where: { tripId, dayIndex },
      orderBy: { sortOrder: "desc" },
    });

    return lastItem ? lastItem.sortOrder + 1 : 0;
  },

  async createItineraryItem(input: {
    tripId: string;
    dayIndex: number;
    dayDate: Date | null;
    itemType: ItineraryItemType;
    itemId: string | null;
    title: string;
    notes?: string;
    scheduledTime?: Date;
    scheduledEndTime?: Date;
    timeSlot: "morning" | "afternoon" | "evening";
    sortOrder: number;
  }) {
    return prisma.itineraryItem.create({ data: input });
  },

  async findOwnedItem(userId: string, tripId: string, itemId: string) {
    return prisma.itineraryItem.findFirst({
      where: {
        id: itemId,
        tripId,
        trip: { userId },
      },
    });
  },

  async updateItineraryItem(
    userId: string,
    tripId: string,
    itemId: string,
    data: Prisma.ItineraryItemUpdateInput,
  ) {
    const item = await this.findOwnedItem(userId, tripId, itemId);
    if (!item) {
      return null;
    }

    return prisma.itineraryItem.update({
      where: { id: itemId },
      data,
    });
  },

  async deleteItineraryItem(userId: string, tripId: string, itemId: string) {
    const item = await this.findOwnedItem(userId, tripId, itemId);
    if (!item) {
      return false;
    }

    await prisma.itineraryItem.delete({ where: { id: itemId } });
    return true;
  },

  async reorderItems(
    userId: string,
    tripId: string,
    dayIndex: number,
    items: Array<{ id: string; position: number }>,
  ) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findFirst({ where: { id: tripId, userId } });
      if (!trip) {
        return null;
      }

      for (const entry of items) {
        const item = await tx.itineraryItem.findFirst({
          where: { id: entry.id, tripId, dayIndex },
        });

        if (!item) {
          throw new Error("ITEM_NOT_IN_DAY");
        }

        await tx.itineraryItem.update({
          where: { id: entry.id },
          data: { sortOrder: entry.position },
        });
      }

      return true;
    });
  },

  async moveItem(
    userId: string,
    tripId: string,
    itemId: string,
    targetDayId: string,
    position: number,
  ) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.itineraryItem.findFirst({
        where: { id: itemId, tripId, trip: { userId } },
      });

      if (!item) {
        return null;
      }

      const targetDay = await tx.tripDay.findFirst({
        where: { id: targetDayId, tripId, trip: { userId } },
      });

      if (!targetDay) {
        throw new Error("TARGET_DAY_NOT_FOUND");
      }

      return tx.itineraryItem.update({
        where: { id: itemId },
        data: {
          dayIndex: targetDay.dayIndex,
          dayDate: targetDay.dayDate,
          sortOrder: position,
        },
      });
    });
  },
};

export function isItineraryOutOfRangeError(error: unknown): boolean {
  return error instanceof Error && error.message === "ITINERARY_OUT_OF_RANGE";
}

export function isItemNotInDayError(error: unknown): boolean {
  return error instanceof Error && error.message === "ITEM_NOT_IN_DAY";
}

export function isTargetDayNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message === "TARGET_DAY_NOT_FOUND";
}
