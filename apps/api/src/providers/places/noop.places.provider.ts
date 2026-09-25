import type { PlacesProvider } from "./places.provider.js";
import type {
  NormalizedLocation,
  NormalizedPlace,
  PlacesAutocompleteInput,
  PlacesAutocompleteSuggestion,
  PlacesNearbyInput,
  PlacesSearchInput,
  ReverseGeocodeInput,
} from "./places.types.js";

export class NoopPlacesProvider implements PlacesProvider {
  readonly name = "none" as const;

  isConfigured(): boolean {
    return false;
  }

  async search(_input: PlacesSearchInput): Promise<NormalizedPlace[]> {
    return [];
  }

  async searchNearby(_input: PlacesNearbyInput): Promise<NormalizedPlace[]> {
    return [];
  }

  async getDetails(_sourceId: string): Promise<NormalizedPlace | null> {
    return null;
  }

  async autocomplete(_input: PlacesAutocompleteInput): Promise<PlacesAutocompleteSuggestion[]> {
    return [];
  }

  async reverseGeocode(_input: ReverseGeocodeInput): Promise<NormalizedLocation | null> {
    return null;
  }
}
