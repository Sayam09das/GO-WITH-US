import type { ProviderSource } from "../provider.types.js";
import type { NormalizedPlace } from "./places.types.js";

type FoursquarePlaceLocation = {
  formatted_address?: string;
  address?: string;
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
};

export function mapFoursquarePlace(place: FoursquarePlaceResult): NormalizedPlace {
  const latitude =
    place.geocodes?.main?.latitude ?? place.location?.latitude ?? place.location?.lat ?? 0;
  const longitude =
    place.geocodes?.main?.longitude ?? place.location?.longitude ?? place.location?.lng ?? 0;

  return {
    id: place.fsq_id,
    name: place.name,
    latitude,
    longitude,
    address: place.location?.formatted_address ?? place.location?.address ?? null,
    category: place.categories?.[0]?.name ?? null,
    source: "foursquare",
    sourceId: place.fsq_id,
  };
}

export function buildNormalizedPlaceId(source: ProviderSource, sourceId: string): string {
  return `${source}:${sourceId}`;
}

export function mapNormalizedPlaceToAutocomplete(place: NormalizedPlace) {
  return {
    id: buildNormalizedPlaceId(place.source, place.sourceId),
    label: place.name,
    source: place.source,
    sourceId: place.sourceId,
  };
}
