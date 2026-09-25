import { z } from "zod";

export const MIN_RADIUS_METERS = 1_000;
export const MAX_RADIUS_METERS = 50_000;
export const DEFAULT_RADIUS_METERS = 10_000;

export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const nearbyLocationSchema = coordinateSchema.extend({
  radius: z.number().int().min(MIN_RADIUS_METERS).max(MAX_RADIUS_METERS).optional(),
});
