import type { Stay } from "../../generated/client.js";
import { AppError } from "../../lib/errors.js";
import { ProviderUnavailableError } from "../../lib/provider-errors.js";
import type { BookingGuestCounts } from "../../modules/bookings/bookings.types.js";
import { buildStayAvailability } from "../../modules/stays/stays.types.js";
import { mapAccommodationAvailabilityToStayResult } from "../../providers/accommodation/accommodation.mapper.js";
import type { NormalizedAccommodationAvailability } from "../../providers/accommodation/accommodation.types.js";
import { providerFactory } from "../../providers/index.js";

function defaultNightlyFrom(tier: Stay["priceTier"], nightlyFrom: number | null): number {
  if (nightlyFrom != null) {
    return nightlyFrom;
  }

  switch (tier) {
    case "budget":
      return 120;
    case "moderate":
      return 220;
    case "luxury":
      return 450;
  }
}

export async function revalidateStayBookingPrice(input: {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: BookingGuestCounts;
  roomId?: string;
  rooms?: number;
  quotedTotal?: number;
}) {
  const accommodationProvider = providerFactory.getAccommodationProvider();
  const roomCount = input.rooms ?? 1;
  const totalGuests = input.guests.adults + input.guests.children;

  if (accommodationProvider.isConfigured() && input.stay.providerPropertyId) {
    let availability: NormalizedAccommodationAvailability | null = null;

    try {
      availability = await accommodationProvider.checkAvailability({
        stayId: input.stay.id,
        providerPropertyId: input.stay.providerPropertyId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        rooms: roomCount,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new ProviderUnavailableError("Live availability is temporarily unavailable.");
    }

    if (!availability) {
      throw new ProviderUnavailableError("Live availability is temporarily unavailable.");
    }

    const mapped = mapAccommodationAvailabilityToStayResult(availability);
    const availableRooms = mapped.rooms.filter((room) => room.available);
    const selectedRoom = input.roomId
      ? availableRooms.find((room) => room.id === input.roomId)
      : availableRooms[0];

    if (!selectedRoom || selectedRoom.totalPrice == null) {
      throw new AppError(409, "AVAILABILITY_CHANGED", "The selected room is no longer available.");
    }

    if (input.quotedTotal != null && input.quotedTotal !== selectedRoom.totalPrice) {
      throw new AppError(409, "PRICE_CHANGED", "The price for this stay has changed.", {
        previousTotal: input.quotedTotal,
        currentTotal: selectedRoom.totalPrice,
        currency: selectedRoom.price?.currency ?? "USD",
      });
    }

    return {
      available: true as const,
      availability: mapped,
      room: selectedRoom,
      unitPrice:
        selectedRoom.nightlyFrom ??
        defaultNightlyFrom(input.stay.priceTier, input.stay.estimatedNightlyFrom),
      totalPrice: selectedRoom.totalPrice,
      nights: mapped.nights,
      guestCount: totalGuests,
      inventoryModel: "provider" as const,
    };
  }

  const guidance = buildStayAvailability({
    stay: input.stay,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    rooms: roomCount,
  });

  if (!guidance.isAvailable) {
    throw new AppError(409, "AVAILABILITY_CHANGED", "The selected room is no longer available.");
  }

  const availableRooms = guidance.rooms.filter((room) => room.available);
  const selectedRoom = input.roomId
    ? availableRooms.find((room) => room.id === input.roomId)
    : availableRooms[0];

  if (!selectedRoom || selectedRoom.totalPrice == null) {
    throw new AppError(409, "AVAILABILITY_CHANGED", "The selected room is no longer available.");
  }

  if (input.quotedTotal != null && input.quotedTotal !== selectedRoom.totalPrice) {
    throw new AppError(409, "PRICE_CHANGED", "The price for this stay has changed.", {
      previousTotal: input.quotedTotal,
      currentTotal: selectedRoom.totalPrice,
      currency: "USD",
    });
  }

  return {
    available: true as const,
    availability: guidance,
    room: selectedRoom,
    unitPrice:
      selectedRoom.nightlyFrom ??
      defaultNightlyFrom(input.stay.priceTier, input.stay.estimatedNightlyFrom),
    totalPrice: selectedRoom.totalPrice,
    nights: guidance.nights,
    guestCount: totalGuests,
    inventoryModel: "guidance" as const,
  };
}
