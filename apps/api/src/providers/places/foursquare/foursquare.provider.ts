import { mapFoursquarePlace, mapNormalizedPlaceToAutocomplete } from "../places.mapper.js";
import type { PlacesProvider } from "../places.provider.js";
import type {
  NormalizedPlace,
  PlacesAutocompleteInput,
  PlacesAutocompleteSuggestion,
  PlacesNearbyInput,
  PlacesSearchInput,
} from "../places.types.js";
import { FoursquareClient } from "./foursquare.client.js";

export class FoursquarePlacesProvider implements PlacesProvider {
  readonly name = "foursquare" as const;
  private readonly client = new FoursquareClient();

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  async search(input: PlacesSearchInput): Promise<NormalizedPlace[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const response = await this.client.searchPlaces({
      query: input.query,
      limit: input.limit ?? 20,
      latitude: input.near?.latitude,
      longitude: input.near?.longitude,
    });

    return (response.results ?? []).map(mapFoursquarePlace);
  }

  async searchNearby(input: PlacesNearbyInput): Promise<NormalizedPlace[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const response = await this.client.searchPlaces({
      query: input.query ?? "restaurant",
      limit: input.limit ?? 20,
      latitude: input.latitude,
      longitude: input.longitude,
      radius: input.radiusMeters ?? 2_000,
    });

    return (response.results ?? []).map(mapFoursquarePlace);
  }

  async getDetails(sourceId: string): Promise<NormalizedPlace | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const place = await this.client.getPlace(sourceId);
    return place ? mapFoursquarePlace(place) : null;
  }

  async autocomplete(input: PlacesAutocompleteInput): Promise<PlacesAutocompleteSuggestion[]> {
    const places = await this.search({
      query: input.query,
      limit: input.limit ?? 8,
      near: input.near,
    });

    return places.map(mapNormalizedPlaceToAutocomplete);
  }
}
