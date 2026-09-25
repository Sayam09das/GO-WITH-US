import { z } from "zod";

export const storyCategorySchema = z.enum([
  "editorial",
  "guides",
  "journeys",
  "tips",
  "inspiration",
]);

export const listStoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: storyCategorySchema.optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export const storySearchSchema = z.object({
  query: z.string().trim().max(120).optional(),
  category: storyCategorySchema.optional(),
  featured: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export const storySlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(160),
});

export type StoryCategory = z.infer<typeof storyCategorySchema>;
export type StorySearchInput = z.infer<typeof storySearchSchema>;
