import { z } from "zod";

const dateString = z.string().date();
const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format.");

export const listTripsQuerySchema = z.object({
  status: z
    .enum(["draft", "upcoming", "active", "ongoing", "past", "completed", "cancelled"])
    .optional(),
});

export const createTripSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    destinationId: z.string().uuid().optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    description: z.string().trim().max(2000).optional(),
    coverImage: z.string().url().max(2048).optional(),
  })
  .refine(
    (input) => {
      if (!input.startDate || !input.endDate) {
        return true;
      }

      return input.endDate >= input.startDate;
    },
    {
      message: "End date must be on or after start date.",
      path: ["endDate"],
    },
  );

export const updateTripSchema = z
  .object({
    title: z.string().trim().min(2).max(160).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    startDate: dateString.optional().nullable(),
    endDate: dateString.optional().nullable(),
    coverImage: z.string().url().max(2048).optional().nullable(),
    status: z.enum(["draft", "upcoming", "active", "completed", "cancelled"]).optional(),
  })
  .refine(
    (input) => {
      if (input.startDate == null || input.endDate == null) {
        return true;
      }

      return input.endDate >= input.startDate;
    },
    {
      message: "End date must be on or after start date.",
      path: ["endDate"],
    },
  );

export const tripIdParamSchema = z.object({
  tripId: z.string().uuid(),
});

export const tripDayParamSchema = z.object({
  tripId: z.string().uuid(),
  dayId: z.string().uuid(),
});

export const tripDayItemParamSchema = tripDayParamSchema.extend({
  itemId: z.string().uuid(),
});

export const tripItemMoveParamSchema = z.object({
  tripId: z.string().uuid(),
  itemId: z.string().uuid(),
});

export const createTripDaySchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
});

export const updateTripDaySchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  dayDate: dateString.optional(),
});

export const createItineraryItemSchema = z
  .object({
    type: z.enum(["destination", "stay", "experience", "restaurant", "custom"]),
    destinationId: z.string().uuid().optional(),
    stayId: z.string().uuid().optional(),
    experienceId: z.string().uuid().optional(),
    title: z.string().trim().min(1).max(200).optional(),
    startTime: timeString.optional(),
    endTime: timeString.optional(),
    notes: z.string().trim().max(2000).optional(),
    position: z.number().int().min(0).optional(),
  })
  .superRefine((input, context) => {
    if (input.type === "destination" && !input.destinationId) {
      context.addIssue({
        code: "custom",
        message: "destinationId is required for destination items.",
        path: ["destinationId"],
      });
    }

    if (input.type === "stay" && !input.stayId) {
      context.addIssue({
        code: "custom",
        message: "stayId is required for stay items.",
        path: ["stayId"],
      });
    }

    if (input.type === "experience" && !input.experienceId) {
      context.addIssue({
        code: "custom",
        message: "experienceId is required for experience items.",
        path: ["experienceId"],
      });
    }

    if ((input.type === "custom" || input.type === "restaurant") && !input.title) {
      context.addIssue({
        code: "custom",
        message: "title is required for custom and restaurant items.",
        path: ["title"],
      });
    }
  });

export const updateItineraryItemSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  startTime: timeString.optional().nullable(),
  endTime: timeString.optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  position: z.number().int().min(0).optional(),
});

export const reorderItineraryItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(0),
      }),
    )
    .min(1),
});

export const moveItineraryItemSchema = z.object({
  targetDayId: z.string().uuid(),
  position: z.number().int().min(0),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CreateItineraryItemInput = z.infer<typeof createItineraryItemSchema>;
export type UpdateItineraryItemInput = z.infer<typeof updateItineraryItemSchema>;
export type TripStatusFilter = NonNullable<z.infer<typeof listTripsQuerySchema>["status"]>;
