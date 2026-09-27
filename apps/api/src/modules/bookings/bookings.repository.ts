import type { BookingStatus, BookingType, Prisma } from "@prisma/client";
import { prisma } from "../../lib/db.js";
import { AppError } from "../../lib/errors.js";
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

async function assertStayAvailability(
  tx: Prisma.TransactionClient,
  input: {
    stayId: string;
    checkIn: Date;
    checkOut: Date;
  },
): Promise<void> {
  const conflicts = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT b.id
    FROM booking_items bi
    INNER JOIN bookings b ON b.id = bi.booking_id
    WHERE bi.stay_id = ${input.stayId}::uuid
      AND b.status NOT IN ('cancelled', 'expired')
      AND bi.check_in IS NOT NULL
      AND bi.check_out IS NOT NULL
      AND bi.check_in < ${input.checkOut}
      AND bi.check_out > ${input.checkIn}
    LIMIT 1
    FOR UPDATE OF b
  `;

  if (conflicts.length > 0) {
    throw new AppError(409, "BOOKING_NOT_AVAILABLE", "The selected option is no longer available.");
  }
}

async function assertExperienceAvailability(
  tx: Prisma.TransactionClient,
  input: {
    experienceId: string;
    experienceDate: Date;
    guestCount: number;
  },
): Promise<void> {
  await tx.$queryRaw`
    SELECT b.id
    FROM booking_items bi
    INNER JOIN bookings b ON b.id = bi.booking_id
    WHERE bi.experience_id = ${input.experienceId}::uuid
      AND bi.experience_date = ${input.experienceDate}
      AND b.status NOT IN ('cancelled', 'expired')
    FOR UPDATE OF b
  `;

  const capacityRows = await tx.$queryRaw<Array<{ bookedGuests: number | null }>>`
    SELECT COALESCE(SUM((bi.guests->>'adults')::int + (bi.guests->>'children')::int), 0)::int AS "bookedGuests"
    FROM booking_items bi
    INNER JOIN bookings b ON b.id = bi.booking_id
    WHERE bi.experience_id = ${input.experienceId}::uuid
      AND bi.experience_date = ${input.experienceDate}
      AND b.status NOT IN ('cancelled', 'expired')
  `;

  const maxGuests = 12;
  const bookedGuests = capacityRows[0]?.bookedGuests ?? 0;

  if (bookedGuests + input.guestCount > maxGuests) {
    throw new AppError(409, "BOOKING_NOT_AVAILABLE", "The selected option is no longer available.");
  }
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
      if (input.item.stayId && input.item.checkIn && input.item.checkOut) {
        await assertStayAvailability(tx, {
          stayId: input.item.stayId,
          checkIn: input.item.checkIn,
          checkOut: input.item.checkOut,
        });
      }

      if (input.item.experienceId && input.item.experienceDate) {
        await assertExperienceAvailability(tx, {
          experienceId: input.item.experienceId,
          experienceDate: input.item.experienceDate,
          guestCount: input.item.guests.adults + input.item.guests.children,
        });
      }

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
