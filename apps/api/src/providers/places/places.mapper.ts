import type { ProviderSource } from "../provider.types.js";
import type { NormalizedPlace, PlacesAutocompleteSuggestion } from "./places.types.js";

type FoursquarePlaceLocation = {
  formatted_address?: string;
  address?: string;
  locality?: string;
  region?: string;
  country?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

type FoursquarePlaceResult = {
  fsq_id: string;
  name: string;
  location?: FoursquarePlaceLocation;
  geocodes?: {
    main?: {
      latitude?: number;
      longitude?: number;
    };
  };
  categories?: Array<{ name?: string }>;
  rating?: number;
  photos?: Array<{ prefix?: string; suffix?: string }>;
};

const RESTAURANT_CATEGORY_PATTERN =
  /restaurant|food|cafe|coffee|dining|bistro|bakery|bar|pub|eatery/i;

export function buildNormalizedPlaceId(provider: ProviderSource, providerPlaceId: string): string {
  return `${provider}:${providerPlaceId}`;
}

export function mapFoursquarePlace(place: FoursquarePlaceResult): NormalizedPlace {
  const provider: ProviderSource = "foursquare";
  const providerPlaceId = place.fsq_id;
  const latitude =
    place.geocodes?.main?.latitude ?? place.location?.latitude ?? place.location?.lat ?? 0;
  const longitude =
    place.geocodes?.main?.longitude ?? place.location?.longitude ?? place.location?.lng ?? 0;
  const photo = place.photos?.[0];

  return {
    id: buildNormalizedPlaceId(provider, providerPlaceId),
    provider,
    providerPlaceId,
    name: place.name,
    latitude,
    longitude,
    address: place.location?.formatted_address ?? place.location?.address ?? null,
    city: place.location?.locality ?? null,
    region: place.location?.region ?? null,
    country: place.location?.country ?? null,
    countryCode: null,
    category: place.categories?.[0]?.name ?? null,
    rating: place.rating ?? null,
    image: photo?.prefix && photo.suffix ? `${photo.prefix}original${photo.suffix}` : null,
    source: provider,
    sourceId: providerPlaceId,
  };
}

export function mapNormalizedPlaceToAutocomplete(
  place: NormalizedPlace,
): PlacesAutocompleteSuggestion {
  return {
    id: place.id,
    label: place.name,
    provider: place.provider,
    providerPlaceId: place.providerPlaceId,
    source: place.provider,
    sourceId: place.providerPlaceId,
  };
}

export function isRestaurantPlace(place: NormalizedPlace): boolean {
  if (!place.category) {
    return true;
  }

  return RESTAURANT_CATEGORY_PATTERN.test(place.category);
}

export function mapNormalizedPlaceToPublicPlace(place: NormalizedPlace) {
  return {
    provider: place.provider,
    providerPlaceId: place.providerPlaceId,
    name: place.name,
    category: place.category,
    address: place.address,
    city: place.city,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    rating: place.rating,
    image: place.image,
  };
}
