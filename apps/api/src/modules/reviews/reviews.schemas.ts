import { z } from "zod";

const targetTypeSchema = z.enum(["DESTINATION", "STAY", "EXPERIENCE", "RESTAURANT"]);

export const createReviewSchema = z
  .object({
    targetType: targetTypeSchema,
    targetId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    title: z.string().trim().max(160).optional(),
    body: z.string().trim().max(2000).optional(),
    content: z.string().trim().max(2000).optional(),
  })
  .transform((input) => ({
    targetType: input.targetType,
    targetId: input.targetId,
    rating: input.rating,
    title: input.title,
    body: input.body ?? input.content,
  }));

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().trim().max(160).optional().nullable(),
  body: z.string().trim().max(2000).optional().nullable(),
  content: z.string().trim().max(2000).optional().nullable(),
});

export const reviewIdParamSchema = z.object({
  reviewId: z.string().uuid(),
});

export const reportReviewSchema = z.object({
  reason: z.enum(["spam", "inappropriate_content", "harassment", "false_information", "other"]),
  details: z.string().trim().max(1000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReportReviewInput = z.infer<typeof reportReviewSchema>;
