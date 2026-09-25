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

export class BookingAccommodationProvider implements AccommodationProvider {
  readonly name = "booking" as const;
  private readonly client = new BookingClient();

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  async searchAvailability(
    input: AccommodationAvailabilityInput,
  ): Promise<NormalizedAccommodationAvailability | null> {
    if (!this.isConfigured() || !input.sourceId) {
      return null;
    }

    const listings = await this.client.searchHotels({
      destination: input.sourceId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.guests.adults,
      children: input.guests.children,
      limit: 5,
    });

    const nights = calculateNights(input.checkIn, input.checkOut);
    const totalGuests = input.guests.adults + input.guests.children;
    const rooms: NormalizedRoomOption[] = (listings.result ?? []).map((item) => {
      const nightlyFrom =
        item.min_total_price != null && nights > 0
          ? Math.round(item.min_total_price / nights)
          : (item.price ?? null);
      const maxGuests = item.max_persons ?? totalGuests;

      return {
        id: String(item.id),
        name: item.name ?? "Room option",
        maxGuests,
        nightlyFrom,
        totalPrice: item.min_total_price ?? item.price ?? null,
        available: maxGuests >= totalGuests,
      };
    });

    if (rooms.length === 0) {
      return null;
    }

    return {
      stayId: input.stayId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      nights,
      isAvailable: rooms.some((room) => room.available),
      rooms,
      source: this.name,
    };
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
      limit: input.limit ?? 20,
    });

    return (listings.result ?? []).map((item) => ({
      id: String(item.id),
      name: item.name ?? "Accommodation",
      source: this.name,
      sourceId: String(item.id),
      locationLabel: [item.city, item.country].filter(Boolean).join(", ") || null,
      nightlyFrom: item.price ?? null,
    }));
  }
}
