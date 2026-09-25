import type { ProviderGeoPoint, ProviderSource } from "../provider.types.js";

/** GO WITH US normalized place — provider-agnostic contract for the application layer. */
export type NormalizedPlace = {
  /** Composite id: `{provider}:{providerPlaceId}` */
  id: string;
  provider: ProviderSource;
  providerPlaceId: string;
  name: string;
  category: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  rating: number | null;
  image: string | null;
  /** @deprecated Use `provider`. */
  source: ProviderSource;
  /** @deprecated Use `providerPlaceId`. */
  sourceId: string;
};

export type PlacesSearchInput = {
  query: string;
  limit?: number;
  near?: ProviderGeoPoint;
  categories?: string[];
};

export type PlacesNearbyInput = {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  query?: string;
  limit?: number;
  categories?: string[];
};

export type PlacesAutocompleteInput = {
  query: string;
  limit?: number;
  near?: ProviderGeoPoint;
};

export type PlacesAutocompleteSuggestion = {
  id: string;
  label: string;
  provider: ProviderSource;
  providerPlaceId: string;
  /** @deprecated Use `provider`. */
  source: ProviderSource;
  /** @deprecated Use `providerPlaceId`. */
  sourceId: string;
};

export type ReverseGeocodeInput = {
  latitude: number;
  longitude: number;
};

export type NormalizedLocation = {
  latitude: number;
  longitude: number;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  label: string | null;
  providerPlaceId: string | null;
  source: ProviderSource;
};
