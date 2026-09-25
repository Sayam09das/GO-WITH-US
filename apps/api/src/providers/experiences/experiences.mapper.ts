import type { NormalizedExperienceAvailability } from "./experiences.types.js";

export type ExperienceAvailabilityResult = {
  experienceId: string;
  date: string;
  startTime: string;
  guests: {
    adults: number;
    children: number;
  };
  isAvailable: boolean;
  options: Array<{
    id: string;
    label: string;
    startTime: string;
    maxGuests: number;
    priceFrom: number | null;
    available: boolean;
  }>;
  meta: {
    inventoryModel: "guidance" | "provider";
    provider?: NormalizedExperienceAvailability["source"];
  };
};

export function mapExperienceAvailabilityToResult(
  availability: NormalizedExperienceAvailability,
): ExperienceAvailabilityResult {
  return {
    experienceId: availability.experienceId,
    date: availability.date,
    startTime: availability.startTime,
    guests: availability.guests,
    isAvailable: availability.isAvailable,
    options: availability.options,
    meta: {
      inventoryModel: "provider",
      provider: availability.source,
    },
  };
}
