import type { ProviderCapabilities } from "../provider.types.js";
import type {
  NormalizedPlace,
  PlacesAutocompleteInput,
  PlacesAutocompleteSuggestion,
  PlacesNearbyInput,
  PlacesSearchInput,
} from "./places.types.js";

export interface PlacesProvider extends ProviderCapabilities {
  search(input: PlacesSearchInput): Promise<NormalizedPlace[]>;
  searchNearby(input: PlacesNearbyInput): Promise<NormalizedPlace[]>;
  getDetails(sourceId: string): Promise<NormalizedPlace | null>;
  autocomplete(input: PlacesAutocompleteInput): Promise<PlacesAutocompleteSuggestion[]>;
}
