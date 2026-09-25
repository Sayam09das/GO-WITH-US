import { buildAvailabilityTimestamps, buildPriceBreakdown } from "../accommodation.mapper.js";
import type { AccommodationProvider } from "../accommodation.provider.js";
import type {
  AccommodationAvailabilityInput,
  AccommodationSearchInput,
  NormalizedAccommodationAvailability,
  NormalizedAccommodationListing,
  NormalizedRoomOption,
} from "../accommodation.types.js";
import { BookingClient } from "./booking.client.js";

function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
  return Math.max(
    0,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function mapListing(item: {
  id: string | number;
  name?: string;
  city?: string;
  country?: string;
  price?: number;
  min_total_price?: number;
  review_score?: number;
  main_photo_url?: string;
  hotel_facilities?: string[];
}): NormalizedAccommodationListing {
  const provider = "booking" as const;
  const providerPropertyId = String(item.id);

  return {
    id: `${provider}:${providerPropertyId}`,
    provider,
    providerPropertyId,
    name: item.name ?? "Accommodation",
    propertyType: null,
    location: {
      city: item.city ?? null,
      country: item.country ?? null,
      latitude: null,
      longitude: null,
    },
    rating: item.review_score ?? null,
    amenities: item.hotel_facilities ?? [],
    image: item.main_photo_url ?? null,
    nightlyFrom: item.price ?? null,
    source: provider,
    sourceId: providerPropertyId,
  };
}

export class BookingAccommodationProvider implements AccommodationProvider {
  readonly name = "booking" as const;
  private readonly client = new BookingClient();

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  async search(input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]> {
    return this.searchListings(input);
  }

  async searchListings(input: AccommodationSearchInput): Promise<NormalizedAccommodationListing[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const listings = await this.client.searchHotels({
      destination: input.destination,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.guests.adults,
      children: input.guests.children,
      rooms: input.rooms ?? 1,
      limit: input.limit ?? 20,
    });

    return (listings.result ?? []).map(mapListing);
  }

  async getDetails(providerPropertyId: string): Promise<NormalizedAccommodationListing | null> {
    const listings = await this.searchListings({
      destination: providerPropertyId,
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
      guests: { adults: 2, children: 0 },
      rooms: 1,
      limit: 1,
    });

    return (
      listings.find((item) => item.providerPropertyId === providerPropertyId) ?? listings[0] ?? null
    );
  }

  async checkAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return this.searchAvailability(input);
  }

  async getRates(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    return this.searchAvailability(input);
  }

  async searchAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    const providerPropertyId = input.providerPropertyId ?? input.sourceId;
    if (!this.isConfigured() || !providerPropertyId) {
      return null;
    }

    const listings = await this.client.searchHotels({
      destination: providerPropertyId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.guests.adults,
      children: input.guests.children,
      rooms: input.rooms ?? 1,
      limit: 10,
    });

    const nights = calculateNights(input.checkIn, input.checkOut);
    const totalGuests = input.guests.adults + input.guests.children;
    const timestamps = buildAvailabilityTimestamps();

    const options: NormalizedRoomOption[] = (listings.result ?? [])
      .filter((item) => String(item.id) === providerPropertyId)
      .map((item) => {
        const nightlyFrom =
          item.min_total_price != null && nights > 0
            ? Math.round(item.min_total_price / nights)
            : (item.price ?? null);
        const totalPrice = item.min_total_price ?? item.price ?? null;
        const maxGuests = item.max_persons ?? totalGuests;

        return {
          id: String(item.id),
          name: item.name ?? "Room option",
          maxGuests,
          nightlyFrom,
          totalPrice,
          available: maxGuests >= totalGuests,
          price: buildPriceBreakdown({ totalAmount: totalPrice, nightlyFrom, nights }),
          cancellationPolicy: null,
        };
      });

    if (options.length === 0) {
      const fallbackOptions: NormalizedRoomOption[] = (listings.result ?? []).map((item) => {
        const nightlyFrom =
          item.min_total_price != null && nights > 0
            ? Math.round(item.min_total_price / nights)
            : (item.price ?? null);
        const totalPrice = item.min_total_price ?? item.price ?? null;
        const maxGuests = item.max_persons ?? totalGuests;

        return {
          id: String(item.id),
          name: item.name ?? "Room option",
          maxGuests,
          nightlyFrom,
          totalPrice,
          available: maxGuests >= totalGuests,
          price: buildPriceBreakdown({ totalAmount: totalPrice, nightlyFrom, nights }),
          cancellationPolicy: null,
        };
      });

      if (fallbackOptions.length === 0) {
        return null;
      }

      return {
        stayId: input.stayId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        roomCount: input.rooms ?? 1,
        nights,
        isAvailable: fallbackOptions.some((room) => room.available),
        options: fallbackOptions,
        source: this.name,
        ...timestamps,
      };
    }

    return {
      stayId: input.stayId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      roomCount: input.rooms ?? 1,
      nights,
      isAvailable: options.some((room) => room.available),
      options,
      source: this.name,
      ...timestamps,
    };
  }
}
