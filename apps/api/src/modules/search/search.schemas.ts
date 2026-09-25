import { z } from "zod";
import { nearbyLocationSchema } from "../../services/location/location.schema.js";

export const globalSearchQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  type: z.enum(["destination", "stay", "experience", "restaurant", "story", "all"]).optional(),
});

export const globalSearchBodySchema = z.object({
  query: z.string().trim().max(120).optional(),
  limit: z.number().int().min(1).max(50).default(12),
  types: z
    .array(z.enum(["DESTINATION", "STAY", "EXPERIENCE", "RESTAURANT", "STORY", "PLACE"]))
    .optional(),
  location: nearbyLocationSchema.optional(),
});

export type GlobalSearchQuery = z.infer<typeof globalSearchQuerySchema>;
export type GlobalSearchBody = z.infer<typeof globalSearchBodySchema>;
