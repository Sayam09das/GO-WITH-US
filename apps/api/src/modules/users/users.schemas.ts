import { PROFILE_INTEREST_IDS, PROFILE_STYLE_TAG_IDS } from "@gowithus/types";
import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

const profilePreferencesSchema = z
  .object({
    dateOfBirth: z.string().trim().max(32).optional().nullable(),
    preferredCurrency: optionalText(12),
    preferredLanguage: optionalText(80),
    travelPace: optionalText(40),
    accommodationPreference: optionalText(80),
  })
  .partial()
  .optional();

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  bio: optionalText(500),
  phone: optionalText(40),
  country: optionalText(120),
  timezone: optionalText(80),
  homeCity: optionalText(120),
  budgetPreference: z.enum(["budget", "moderate", "luxury"]).optional().nullable(),
  travelInterests: z
    .array(z.string().refine((value) => PROFILE_INTEREST_IDS.has(value)))
    .max(12)
    .optional(),
  travelStyleTags: z
    .array(z.string().refine((value) => PROFILE_STYLE_TAG_IDS.has(value)))
    .max(10)
    .optional(),
  preferences: profilePreferencesSchema,
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

export const experienceIdParamSchema = z.object({
  experienceId: z.string().uuid(),
});

export const restaurantIdParamSchema = z.object({
  restaurantId: z.string().uuid(),
});

export const tripStatusQuerySchema = z.object({
  status: z.enum(["draft", "upcoming", "active", "completed"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
