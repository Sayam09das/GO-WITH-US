import { z } from "zod";
import { nearbyLocationSchema } from "../../services/location/location.schema.js";

const listSortSchema = z.enum(["popular", "rating", "duration", "price", "newest"]);
const searchSortSchema = z.enum(["popular", "rating", "price", "newest"]);
const reviewSortSchema = z.enum(["recent", "rating"]);

export const experienceCategorySchema = z.enum([
  "tours",
  "outdoor",
  "cultural",
  "food-dining",
  "attractions",
]);

export const listExperiencesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  q: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  category: experienceCategorySchema.optional(),
  budgetTier: z.enum(["budget", "moderate", "luxury"]).optional(),
  duration: z.enum(["half-day", "full-day", "multi-day"]).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: listSortSchema.default("popular"),
});

export const experienceSearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  location: nearbyLocationSchema.optional(),
  date: z.string().date().optional(),
  categories: z.array(experienceCategorySchema).max(20).optional(),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  duration: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  rating: z.number().min(1).max(5).optional(),
  sort: searchSortSchema.default("popular"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export const experienceSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export const experienceIdParamSchema = z.object({
  experienceId: z.string().trim().min(1).max(160),
});

export const listExperienceReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: reviewSortSchema.default("recent"),
});

export const createExperienceReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(2000).optional(),
});

const guestsSchema = z.object({
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10).default(0),
});

export const experienceAvailabilitySchema = z.object({
  date: z.string().date(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  guests: guestsSchema,
});

export type ExperienceListSort = z.infer<typeof listSortSchema>;
export type ExperienceSearchSort = z.infer<typeof searchSortSchema>;
export type ExperienceCategoryInput = z.infer<typeof experienceCategorySchema>;
export type ExperienceSearchInput = z.infer<typeof experienceSearchSchema>;
export type ListExperiencesQuery = z.infer<typeof listExperiencesQuerySchema>;
