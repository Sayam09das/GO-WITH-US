import { AppError } from "../../lib/errors.js";
import { providerFactory } from "../../providers/index.js";
import type { NormalizedLocation } from "../../providers/places/places.types.js";
import { DEFAULT_RADIUS_METERS, MAX_RADIUS_METERS, MIN_RADIUS_METERS } from "./location.schema.js";
import type { NearbyLocationInput } from "./location.types.js";

export const locationService = {
  validateCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new AppError(400, "VALIDATION_ERROR", "Latitude must be between -90 and 90.");
    }

    if (longitude < -180 || longitude > 180) {
      throw new AppError(400, "VALIDATION_ERROR", "Longitude must be between -180 and 180.");
    }
  },

  normalizeNearbyLocation(input: {
    lat: number;
    lng: number;
    radius?: number;
  }): NearbyLocationInput {
    this.validateCoordinates(input.lat, input.lng);

    const radiusMeters = input.radius ?? DEFAULT_RADIUS_METERS;
    if (radiusMeters < MIN_RADIUS_METERS || radiusMeters > MAX_RADIUS_METERS) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        `Radius must be between ${MIN_RADIUS_METERS} and ${MAX_RADIUS_METERS} meters.`,
      );
    }

    return {
      latitude: input.lat,
      longitude: input.lng,
      radiusMeters,
    };
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<NormalizedLocation | null> {
    this.validateCoordinates(latitude, longitude);

    const placesProvider = providerFactory.getPlacesProvider();
    if (!placesProvider.isConfigured()) {
      return null;
    }

    return placesProvider.reverseGeocode({ latitude, longitude });
  },

  formatLocationLabel(location: NormalizedLocation | null): string | null {
    if (!location) {
      return null;
    }

    return (
      location.label ??
      [location.city, location.region, location.country].filter(Boolean).join(", ") ??
      null
    );
  },

  async resolvePlaceCoordinates(input: {
    query: string;
    near?: { lat: number; lng: number };
  }): Promise<{ latitude: number; longitude: number } | null> {
    const query = input.query.trim();
    if (!query) {
      return null;
    }

    const placesProvider = providerFactory.getPlacesProvider();
    if (!placesProvider.isConfigured()) {
      return null;
    }

    const results = await placesProvider.search({
      query,
      limit: 1,
      near: input.near
        ? {
            latitude: input.near.lat,
            longitude: input.near.lng,
          }
        : undefined,
    });

    const place = results[0];
    if (!place || !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      return null;
    }

    return {
      latitude: place.latitude,
      longitude: place.longitude,
    };
  },
};
