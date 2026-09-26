import { logger } from "../../infrastructure/logging/logger.js";
import { enqueueBookingPostCreate } from "../../infrastructure/queue/enqueue.js";
import { logUserActivity } from "../../lib/activity.js";
import { generateBookingReference } from "../../lib/catalog-utils.js";
import { AppError } from "../../lib/errors.js";
import { parseTimeString } from "../trips/trip-utils.js";
import { bookingsRepository } from "./bookings.repository.js";
import type { BookingStatusFilter, CreateBookingInput } from "./bookings.schemas.js";
import {
  calculateExperienceBookingPrice,
  calculateStayBookingPrice,
  toBookingDetail,
  toBookingListItem,
} from "./bookings.types.js";

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export const bookingsService = {
  async createBooking(
    userId: string,
    input: CreateBookingInput,
    idempotencyKey?: string,
  ): Promise<{ booking: ReturnType<typeof toBookingDetail>; created: boolean }> {
    if (idempotencyKey) {
      const existing = await bookingsRepository.findByIdempotencyKey(userId, idempotencyKey);
      if (existing) {
        return { booking: toBookingDetail(existing), created: false };
      }
    }

    const bookingReference = generateBookingReference();

    if (input.type === "STAY") {
      const stay = await bookingsRepository.findPublishedStay(input.stayId!);
      if (!stay) {
        throw new AppError(404, "NOT_FOUND", "Stay not found.");
      }

      const pricing = calculateStayBookingPrice({
        stay,
        checkIn: input.checkIn!,
        checkOut: input.checkOut!,
        guests: input.guests,
        roomId: input.roomId,
        rooms: input.rooms,
        quotedTotal: input.quotedTotal,
      });

      if (!pricing.available) {
        throw new AppError(
          409,
          "BOOKING_NOT_AVAILABLE",
          "The selected option is no longer available.",
        );
      }

      const booking = await bookingsRepository.createBooking({
        userId,
        bookingReference,
        type: "stay",
        startDate: parseDateOnly(input.checkIn!),
        endDate: parseDateOnly(input.checkOut!),
        guestCount: pricing.guestCount,
        totalAmount: pricing.totalPrice,
        idempotencyKey,
        item: {
          stayId: stay.id,
          roomId: pricing.room.id,
          roomLabel: pricing.room.name,
          checkIn: parseDateOnly(input.checkIn!),
          checkOut: parseDateOnly(input.checkOut!),
          guests: input.guests,
          unitPrice: pricing.unitPrice,
          totalPrice: pricing.totalPrice,
        },
      });

      await logUserActivity({
        userId,
        type: "BOOKED_STAY",
        title: `Booked stay: ${stay.title}`,
        metadata: { bookingId: booking.id, stayId: stay.id },
      });

      await enqueueBookingPostCreate({
        type: "post-create",
        userId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
      });

      logger.info("booking.created", {
        userId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        type: "stay",
      });

      return { booking: toBookingDetail(booking), created: true };
    }

    const experience = await bookingsRepository.findPublishedExperience(input.experienceId!);
    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    const pricing = calculateExperienceBookingPrice({
      experience,
      guests: input.guests,
    });

    const booking = await bookingsRepository.createBooking({
      userId,
      bookingReference,
      type: "experience",
      startDate: parseDateOnly(input.experienceDate!),
      endDate: parseDateOnly(input.experienceDate!),
      guestCount: pricing.guestCount,
      totalAmount: pricing.totalPrice,
      idempotencyKey,
      item: {
        experienceId: experience.id,
        experienceDate: parseDateOnly(input.experienceDate!),
        startTime: input.startTime ? parseTimeString(input.startTime) : undefined,
        guests: input.guests,
        unitPrice: pricing.unitPrice,
        totalPrice: pricing.totalPrice,
      },
    });

    await logUserActivity({
      userId,
      type: "BOOKED_EXPERIENCE",
      title: `Booked experience: ${experience.title}`,
      metadata: { bookingId: booking.id, experienceId: experience.id },
    });

    await enqueueBookingPostCreate({
      type: "post-create",
      userId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
    });

    logger.info("booking.created", {
      userId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      type: "experience",
    });

    return { booking: toBookingDetail(booking), created: true };
  },

  async listBookings(userId: string, status?: BookingStatusFilter) {
    const bookings = await bookingsRepository.listBookings(userId, status);
    return bookings.map(toBookingListItem);
  },

  async getBooking(userId: string, bookingId: string) {
    const booking = await bookingsRepository.findOwnedBooking(userId, bookingId);
    if (!booking) {
      throw new AppError(404, "NOT_FOUND", "Booking not found.");
    }

    return toBookingDetail(booking);
  },

  async cancelBooking(userId: string, bookingId: string, note?: string) {
    const updated = await bookingsRepository.cancelBooking(userId, bookingId, note);
    if (updated.count === 0) {
      const existing = await bookingsRepository.findOwnedBooking(userId, bookingId);
      if (!existing) {
        throw new AppError(404, "NOT_FOUND", "Booking not found.");
      }

      throw new AppError(409, "CONFLICT", "This booking cannot be cancelled.");
    }

    const booking = await bookingsRepository.findOwnedBookingAfterCancel(userId, bookingId);
    if (!booking) {
      throw new AppError(404, "NOT_FOUND", "Booking not found.");
    }

    return toBookingDetail(booking);
  },
};
