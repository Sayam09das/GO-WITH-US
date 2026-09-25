import type { ProviderSource } from "../provider.types.js";

export type ExperienceAvailabilityInput = {
  experienceId: string;
  sourceId?: string | null;
  date: string;
  startTime?: string;
  guests: {
    adults: number;
    children: number;
  };
};

export type NormalizedExperienceOption = {
  id: string;
  label: string;
  startTime: string;
  maxGuests: number;
  priceFrom: number | null;
  available: boolean;
};

export type NormalizedExperienceAvailability = {
  experienceId: string;
  date: string;
  startTime: string;
  guests: {
    adults: number;
    children: number;
  };
  isAvailable: boolean;
  options: NormalizedExperienceOption[];
  source: ProviderSource;
};

export type ExperienceSearchInput = {
  destination: string;
  date?: string;
  query?: string;
  limit?: number;
};

export type NormalizedExperienceListing = {
  id: string;
  title: string;
  source: ProviderSource;
  sourceId: string;
  destination: string | null;
  durationLabel: string | null;
  priceFrom: number | null;
};
