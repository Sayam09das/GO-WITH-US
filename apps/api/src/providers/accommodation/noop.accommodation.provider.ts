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

  async search(_input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]> {
    return [];
  }

  async searchListings(
    _input: AccommodationSearchInput,
  ): Promise<NormalizedAccommodationListing[]> {
    return [];
  }

  async checkAvailability(
    _input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return null;
  }

  async searchAvailability(
    _input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return null;
  }

  async getDetails(_providerPropertyId: string): Promise<NormalizedAccommodationListing | null> {
    return null;
  }

  async getRates(
    _input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return null;
  }
}
