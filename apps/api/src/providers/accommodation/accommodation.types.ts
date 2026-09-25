import type { ProviderSource } from "../provider.types.js";

export type AccommodationGuestsInput = {
  adults: number;
  children: number;
};

export type AccommodationAvailabilityInput = {
  stayId: string;
  providerPropertyId?: string | null;
  /** @deprecated Use providerPropertyId */
  sourceId?: string | null;
  checkIn: string;
  checkOut: string;
  guests: AccommodationGuestsInput;
  rooms?: number;
};

export type NormalizedPriceBreakdown = {
  baseAmount: number | null;
  taxAmount: number | null;
  feeAmount: number | null;
  totalAmount: number | null;
  currency: string;
};

export type NormalizedStayLocation = {
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type NormalizedRoomOption = {
  id: string;
  name: string;
  maxGuests: number;
  nightlyFrom: number | null;
  totalPrice: number | null;
  available: boolean;
  price: NormalizedPriceBreakdown;
  cancellationPolicy: string | null;
};

export type NormalizedAccommodationAvailability = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: AccommodationGuestsInput;
  roomCount: number;
  nights: number;
  isAvailable: boolean;
  options: NormalizedRoomOption[];
  source: ProviderSource;
  fetchedAt: string;
  expiresAt: string;
};

export type AccommodationSearchInput = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: AccommodationGuestsInput;
  rooms?: number;
  propertyType?: string;
  limit?: number;
};

export type NormalizedAccommodationListing = {
  id: string;
  provider: ProviderSource;
  providerPropertyId: string;
  name: string;
  propertyType: string | null;
  location: NormalizedStayLocation;
  rating: number | null;
  amenities: string[];
  image: string | null;
  nightlyFrom: number | null;
  /** @deprecated Use provider */
  source: ProviderSource;
  /** @deprecated Use providerPropertyId */
  sourceId: string;
};
