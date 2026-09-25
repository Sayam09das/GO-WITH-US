import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  bio: optionalText(500),
  phone: optionalText(40),
  country: optionalText(120),
  timezone: optionalText(80),
});

export const updateAvatarSchema = z.object({
  avatar: z.string().url().max(2048),
});

export const destinationIdParamSchema = z.object({
  destinationId: z.string().uuid(),
});

export const stayIdParamSchema = z.object({
  stayId: z.string().uuid(),
});

export const tripStatusQuerySchema = z.object({
  status: z.enum(["draft", "upcoming", "active", "completed"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
