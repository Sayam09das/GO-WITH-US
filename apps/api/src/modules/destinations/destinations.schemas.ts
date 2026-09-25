import { z } from "zod";

const sortSchema = z.enum(["popular", "newest", "rating", "name"]);

export const listDestinationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  sort: sortSchema.default("popular"),
});

export const destinationSearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  countries: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  regions: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  categories: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  duration: z
    .object({
      min: z.number().int().min(1).optional(),
      max: z.number().int().min(1).optional(),
    })
    .optional(),
  sort: sortSchema.default("popular"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const destinationSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export const destinationIdParamSchema = z.object({
  destinationId: z.string().trim().min(1).max(160),
});

export const listDestinationReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(["recent", "rating"]).default("recent"),
});

export type DestinationSort = z.infer<typeof sortSchema>;
export type DestinationSearchInput = z.infer<typeof destinationSearchSchema>;
