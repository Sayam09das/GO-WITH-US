import { z } from "zod";
import { nearbyLocationSchema } from "../../services/location/location.schema.js";

const sortSchema = z.enum(["recommended", "rating", "name"]);

export const listPlacesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  q: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  category: z.string().trim().max(80).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
});

export const placeSearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  location: nearbyLocationSchema.optional(),
  categories: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  rating: z.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export const placeSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export const placeIdParamSchema = z.object({
  placeId: z.string().trim().min(1).max(160),
});

export const listPlaceReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(["recent", "rating"]).default("recent"),
});

export const createPlaceReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().max(2000).optional(),
});

export type PlaceSort = z.infer<typeof sortSchema>;
export type PlaceSearchInput = z.infer<typeof placeSearchSchema>;
export type ListPlacesQuery = z.infer<typeof listPlacesQuerySchema>;
