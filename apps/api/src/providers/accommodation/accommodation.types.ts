import type { ProviderSource } from "../provider.types.js";

export type AccommodationAvailabilityInput = {
  stayId: string;
  sourceId?: string | null;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
};

export type NormalizedRoomOption = {
  id: string;
  name: string;
  maxGuests: number;
  nightlyFrom: number | null;
  totalPrice: number | null;
  available: boolean;
};

export type NormalizedAccommodationAvailability = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  nights: number;
  isAvailable: boolean;
  rooms: NormalizedRoomOption[];
  source: ProviderSource;
};

export type AccommodationSearchInput = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  limit?: number;
};

export type NormalizedAccommodationListing = {
  id: string;
  name: string;
  source: ProviderSource;
  sourceId: string;
  locationLabel: string | null;
  nightlyFrom: number | null;
};
