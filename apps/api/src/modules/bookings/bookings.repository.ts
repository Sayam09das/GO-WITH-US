import type { BookingStatus, BookingType, Prisma } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import type { BookingStatusFilter } from "./bookings.schemas.js";

const bookingInclude = {
  items: { orderBy: { createdAt: "asc" as const } },
  payments: { orderBy: { createdAt: "desc" as const } },
} satisfies Prisma.BookingInclude;

function buildBookingListWhere(
  userId: string,
  status?: BookingStatusFilter,
): Prisma.BookingWhereInput {
  if (!status) {
    return { userId };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (status === "cancelled") {
    return { userId, status: "cancelled" };
  }

  if (status === "past") {
    return {
      userId,
      status: { not: "cancelled" },
      OR: [
        { status: "completed" },
        { endDate: { lt: today }, status: { notIn: ["cancelled", "expired"] } },
        { startDate: { lt: today }, endDate: null, status: { notIn: ["cancelled", "expired"] } },
      ],
    };
  }

  return {
    userId,
    status: { in: ["pending", "confirmed"] },
    OR: [{ startDate: { gte: today } }, { startDate: null }],
  };
}

export const bookingsRepository = {
  findByIdempotencyKey(userId: string, idempotencyKey: string) {
    return prisma.booking.findFirst({
      where: { userId, idempotencyKey },
      include: bookingInclude,
    });
  },

  findPublishedStay(stayId: string) {
    return prisma.stay.findFirst({
      where: { id: stayId, isPublished: true },
    });
  },

  findPublishedExperience(experienceId: string) {
    return prisma.experience.findFirst({
      where: { id: experienceId, isPublished: true },
    });
  },

  listBookings(userId: string, status?: BookingStatusFilter) {
    return prisma.booking.findMany({
      where: buildBookingListWhere(userId, status),
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    });
  },

  findOwnedBooking(userId: string, bookingId: string) {
    return prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: bookingInclude,
    });
  },

  createBooking(input: {
    userId: string;
    bookingReference: string;
    type: BookingType;
    startDate: Date | null;
    endDate: Date | null;
    guestCount: number;
    totalAmount: number;
    idempotencyKey?: string;
    item: {
      stayId?: string;
      experienceId?: string;
      roomId?: string;
      roomLabel?: string;
      checkIn?: Date;
      checkOut?: Date;
      experienceDate?: Date;
      startTime?: Date;
      guests: { adults: number; children: number };
      unitPrice: number;
      totalPrice: number;
    };
  }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: input.userId,
          bookingReference: input.bookingReference,
          type: input.type,
          status: "pending",
          paymentStatus: "unpaid",
          startDate: input.startDate,
          endDate: input.endDate,
          guestCount: input.guestCount,
          totalAmount: input.totalAmount,
          idempotencyKey: input.idempotencyKey,
          items: {
            create: {
              stayId: input.item.stayId,
              experienceId: input.item.experienceId,
              roomId: input.item.roomId,
              roomLabel: input.item.roomLabel,
              checkIn: input.item.checkIn,
              checkOut: input.item.checkOut,
              experienceDate: input.item.experienceDate,
              startTime: input.item.startTime,
              guests: input.item.guests,
              unitPrice: input.item.unitPrice,
              totalPrice: input.item.totalPrice,
            },
          },
        },
        include: bookingInclude,
      });

      return booking;
    });
  },

  cancelBooking(userId: string, bookingId: string, note?: string) {
    return prisma.booking.updateMany({
      where: {
        id: bookingId,
        userId,
        status: { in: ["pending", "confirmed"] },
      },
      data: {
        status: "cancelled" satisfies BookingStatus,
        cancellationNote: note,
      },
    });
  },

  findOwnedBookingAfterCancel(userId: string, bookingId: string) {
    return prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: bookingInclude,
    });
  },
};
