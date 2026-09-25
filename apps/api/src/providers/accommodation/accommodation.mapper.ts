import type { StayAvailabilityResult } from "../../modules/stays/stays.types.js";
import type { NormalizedAccommodationAvailability } from "./accommodation.types.js";

export function mapAccommodationAvailabilityToStayResult(
  availability: NormalizedAccommodationAvailability,
): StayAvailabilityResult {
  return {
    stayId: availability.stayId,
    checkIn: availability.checkIn,
    checkOut: availability.checkOut,
    guests: availability.guests,
    nights: availability.nights,
    isAvailable: availability.isAvailable,
    rooms: availability.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: "",
      maxGuests: room.maxGuests,
      bedType: "",
      nightlyFrom: room.nightlyFrom,
      amenities: [],
      totalPrice: room.totalPrice,
      available: room.available,
    })),
    meta: {
      inventoryModel: "provider",
      provider: availability.source,
    },
  };
}
