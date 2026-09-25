import type { ProviderCapabilities } from "../provider.types.js";
import type {
  NormalizedLocation,
  NormalizedPlace,
  PlacesAutocompleteInput,
  PlacesAutocompleteSuggestion,
  PlacesNearbyInput,
  PlacesSearchInput,
  ReverseGeocodeInput,
} from "./places.types.js";

export interface PlacesProvider extends ProviderCapabilities {
  search(input: PlacesSearchInput): Promise<NormalizedPlace[]>;
  searchNearby(input: PlacesNearbyInput): Promise<NormalizedPlace[]>;
  getDetails(sourceId: string): Promise<NormalizedPlace | null>;
  autocomplete(input: PlacesAutocompleteInput): Promise<PlacesAutocompleteSuggestion[]>;
  reverseGeocode(input: ReverseGeocodeInput): Promise<NormalizedLocation | null>;
}
