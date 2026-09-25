import { z } from "zod";

const sortSchema = z.enum(["recommended", "rating", "price"]);

export const listRestaurantsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  q: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  cuisine: z.string().trim().max(80).optional(),
  priceLevel: z.coerce.number().int().min(1).max(4).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
});

export const restaurantSearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(160).optional(),
  cuisines: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  priceLevel: z.array(z.number().int().min(1).max(4)).max(4).optional(),
  rating: z.number().min(1).max(5).optional(),
  sort: sortSchema.default("recommended"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const restaurantSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().trim().min(1).max(160),
});

export const listRestaurantReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(["recent", "rating"]).default("recent"),
});

export const createRestaurantReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().max(2000).optional(),
});

export type RestaurantSort = z.infer<typeof sortSchema>;
export type RestaurantSearchInput = z.infer<typeof restaurantSearchSchema>;
export type ListRestaurantsQuery = z.infer<typeof listRestaurantsQuerySchema>;
