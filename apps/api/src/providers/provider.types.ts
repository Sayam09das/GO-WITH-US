export type ProviderSource = "none" | "seed" | "foursquare" | "google" | "booking" | "amadeus";

export interface ProviderCapabilities {
  readonly name: ProviderSource;
  isConfigured(): boolean;
}

export type ProviderGeoPoint = {
  latitude: number;
  longitude: number;
};
