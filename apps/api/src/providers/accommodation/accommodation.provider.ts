import type { ProviderCapabilities } from "../provider.types.js";
import type {
  AccommodationAvailabilityInput,
  AccommodationSearchInput,
  NormalizedAccommodationAvailability,
  NormalizedAccommodationListing,
} from "./accommodation.types.js";

export interface AccommodationProvider extends ProviderCapabilities {
  search(input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]>;
  searchListings(input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]>;
  checkAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null>;
  searchAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null>;
  getDetails(providerPropertyId: string): Promise<NormalizedAccommodationListing | null>;
  getRates(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null>;
}
