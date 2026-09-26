import { z } from "zod";

const sortSchema = z.enum(["recommended", "rating", "price", "newest"]);
const propertyTypeSchema = z.enum(["boutique-hotel", "villa", "apartment", "eco-lodge", "lodge"]);

const guestsSchema = z.object({
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10).default(0),
});

export const listStaysQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  q: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  propertyType: propertyTypeSchema.optional(),
  budgetTier: z.enum(["budget", "moderate", "luxury"]).optional(),
  amenities: z
    .string()
    .trim()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
        : undefined,
    ),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
});

export const staySearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  checkIn: z.string().date().optional(),
  checkOut: z.string().date().optional(),
  guests: guestsSchema.optional(),
  rooms: z.number().int().min(1).max(10).default(1),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  amenities: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  rating: z.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export const staySlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export const stayIdParamSchema = z.object({
  stayId: z.string().trim().min(1).max(160),
});

export const stayAvailabilitySchema = z
  .object({
    checkIn: z.string().date(),
    checkOut: z.string().date(),
    guests: guestsSchema,
    rooms: z.number().int().min(1).max(10).default(1),
  })
  .refine((input) => input.checkOut > input.checkIn, {
    message: "Check-out must be after check-in.",
    path: ["checkOut"],
  });

export const listStayReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const createStayReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(2000).optional(),
});

export type StaySort = z.infer<typeof sortSchema>;
export type StaySearchInput = z.infer<typeof staySearchSchema>;
export type ListStaysQuery = z.infer<typeof listStaysQuerySchema>;
