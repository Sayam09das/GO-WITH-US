import { z } from "zod";

const dateString = z.string().date();
const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format.");

export const guestsSchema = z.object({
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10).default(0),
});

export const createBookingSchema = z
  .object({
    type: z.enum(["STAY", "EXPERIENCE"]),
    stayId: z.string().uuid().optional(),
    experienceId: z.string().uuid().optional(),
    roomId: z.string().trim().min(1).max(160).optional(),
    checkIn: dateString.optional(),
    checkOut: dateString.optional(),
    experienceDate: dateString.optional(),
    startTime: timeString.optional(),
    guests: guestsSchema,
  })
  .superRefine((input, ctx) => {
    if (input.type === "STAY") {
      if (!input.stayId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "stayId is required for stay bookings.",
          path: ["stayId"],
        });
      }
      if (!input.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "checkIn is required for stay bookings.",
          path: ["checkIn"],
        });
      }
      if (!input.checkOut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "checkOut is required for stay bookings.",
          path: ["checkOut"],
        });
      }
      if (input.checkIn && input.checkOut && input.checkOut <= input.checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Check-out must be after check-in.",
          path: ["checkOut"],
        });
      }
    }

    if (input.type === "EXPERIENCE") {
      if (!input.experienceId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "experienceId is required for experience bookings.",
          path: ["experienceId"],
        });
      }
      if (!input.experienceDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "experienceDate is required for experience bookings.",
          path: ["experienceDate"],
        });
      }
    }
  });

export const listBookingsQuerySchema = z.object({
  status: z.enum(["upcoming", "past", "cancelled"]).optional(),
});

export const bookingIdParamSchema = z.object({
  bookingId: z.string().uuid(),
});

export const cancelBookingSchema = z.object({
  note: z.string().trim().max(1000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingStatusFilter = NonNullable<z.infer<typeof listBookingsQuerySchema>["status"]>;
