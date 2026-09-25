import type { ProviderCapabilities } from "../provider.types.js";
import type {
  AccommodationAvailabilityInput,
  AccommodationSearchInput,
  NormalizedAccommodationAvailability,
  NormalizedAccommodationListing,
} from "./accommodation.types.js";

export interface AccommodationProvider extends ProviderCapabilities {
  searchAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null>;
  searchListings(input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]>;
}
