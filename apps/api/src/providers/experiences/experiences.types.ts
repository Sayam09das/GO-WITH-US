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
  destination?: string;
  date?: string;
  query?: string;
  limit?: number;
  location?: {
    latitude: number;
    longitude: number;
    radiusMeters?: number;
  };
};

export type NormalizedExperienceListing = {
  id: string;
  provider: ProviderSource;
  providerExperienceId: string;
  title: string;
  description: string | null;
  destination: string | null;
  location: {
    city: string | null;
    country: string | null;
    latitude: number;
    longitude: number;
  };
  durationLabel: string | null;
  rating: number | null;
  price: {
    amount: number | null;
    currency: string;
  };
  image: string | null;
  /** @deprecated Use `provider`. */
  source: ProviderSource;
  /** @deprecated Use `providerExperienceId`. */
  sourceId: string;
};
