import type { AccommodationProvider } from "./accommodation.provider.js";
import type {
  AccommodationAvailabilityInput,
  AccommodationSearchInput,
  NormalizedAccommodationAvailability,
  NormalizedAccommodationListing,
} from "./accommodation.types.js";

export class NoopAccommodationProvider implements AccommodationProvider {
  readonly name = "none" as const;

  isConfigured(): boolean {
    return false;
  }

  async searchAvailability(
    _input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return null;
  }

  async searchListings(
    _input: AccommodationSearchInput,
  ): Promise<NormalizedAccommodationListing[]> {
    return [];
  }
}
