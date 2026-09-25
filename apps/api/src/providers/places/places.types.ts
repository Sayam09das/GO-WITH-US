import type { ProviderGeoPoint, ProviderSource } from "../provider.types.js";

export type NormalizedPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  category: string | null;
  source: ProviderSource;
  sourceId: string;
};

export type PlacesSearchInput = {
  query: string;
  limit?: number;
  near?: ProviderGeoPoint;
};

export type PlacesNearbyInput = {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  query?: string;
  limit?: number;
};

export type PlacesAutocompleteInput = {
  query: string;
  limit?: number;
  near?: ProviderGeoPoint;
};

export type PlacesAutocompleteSuggestion = {
  id: string;
  label: string;
  source: ProviderSource;
  sourceId: string;
};
