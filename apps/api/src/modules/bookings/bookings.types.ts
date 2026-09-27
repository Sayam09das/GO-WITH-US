import type {
  Booking,
  BookingItem,
  BookingStatus,
  BookingType,
  BudgetTier,
  Experience,
  Payment,
  PaymentStatus,
  Stay,
} from "@prisma/client";
import { AppError } from "../../lib/errors.js";
import { buildStayAvailability } from "../stays/stays.types.js";

export type BookingGuestCounts = {
  adults: number;
  children: number;
};

export type BookingItemDetail = {
  id: string;
  stayId: string | null;
  experienceId: string | null;
  roomId: string | null;
  roomLabel: string | null;
  checkIn: string | null;
  checkOut: string | null;
  experienceDate: string | null;
  startTime: string | null;
  guests: BookingGuestCounts;
  unitPrice: number;
  totalPrice: number;
};

export type BookingPaymentSummary = {
  id: string;
  provider: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
};

export type BookingListItem = {
  id: string;
  bookingReference: string;
  type: BookingType;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  startDate: string | null;
  endDate: string | null;
  guestCount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export type BookingDetail = BookingListItem & {
  items: BookingItemDetail[];
  payments: BookingPaymentSummary[];
  cancellationNote: string | null;
};

function formatDateOnly(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
}

function formatTimeOnly(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(11, 16);
}

function defaultNightlyFrom(tier: BudgetTier, nightlyFrom: number | null): number {
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

export function defaultExperiencePrice(
  tier: BudgetTier,
  estimatedPriceFrom: number | null,
): number {
  if (estimatedPriceFrom != null) {
    return estimatedPriceFrom;
  }

  switch (tier) {
    case "budget":
      return 45;
    case "moderate":
      return 95;
    case "luxury":
      return 180;
  }
}

export function calculateStayBookingPrice(input: {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: BookingGuestCounts;
  roomId?: string;
  rooms?: number;
  quotedTotal?: number;
}) {
  const availability = buildStayAvailability({
    stay: input.stay,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    rooms: input.rooms,
  });

  if (!availability.isAvailable) {
    return { available: false as const, availability };
  }

  const totalGuests = input.guests.adults + input.guests.children;
  const availableRooms = availability.rooms.filter((room) => room.available);

  const selectedRoom = input.roomId
    ? availableRooms.find((room) => room.id === input.roomId)
    : availableRooms[0];

  if (!selectedRoom || selectedRoom.totalPrice == null) {
    return { available: false as const, availability };
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
    availability,
    room: selectedRoom,
    unitPrice:
      selectedRoom.nightlyFrom ??
      defaultNightlyFrom(input.stay.priceTier, input.stay.estimatedNightlyFrom),
    totalPrice: selectedRoom.totalPrice,
    nights: availability.nights,
    guestCount: totalGuests,
  };
}

export function calculateExperienceBookingPrice(input: {
  experience: Experience;
  guests: BookingGuestCounts;
}) {
  const unitPrice = defaultExperiencePrice(
    input.experience.priceTier,
    input.experience.estimatedPriceFrom,
  );
  const guestCount = input.guests.adults + input.guests.children;

  return {
    unitPrice,
    totalPrice: unitPrice * guestCount,
    guestCount,
  };
}

function parseGuests(value: unknown): BookingGuestCounts {
  if (typeof value !== "object" || value == null) {
    return { adults: 1, children: 0 };
  }

  const record = value as Record<string, unknown>;
  return {
    adults: typeof record.adults === "number" ? record.adults : 1,
    children: typeof record.children === "number" ? record.children : 0,
  };
}

function toBookingItemDetail(item: BookingItem): BookingItemDetail {
  return {
    id: item.id,
    stayId: item.stayId,
    experienceId: item.experienceId,
    roomId: item.roomId,
    roomLabel: item.roomLabel,
    checkIn: formatDateOnly(item.checkIn),
    checkOut: formatDateOnly(item.checkOut),
    experienceDate: formatDateOnly(item.experienceDate),
    startTime: formatTimeOnly(item.startTime),
    guests: parseGuests(item.guests),
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  };
}

function toBookingPaymentSummary(payment: Payment): BookingPaymentSummary {
  return {
    id: payment.id,
    provider: payment.provider,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    paidAt: payment.paidAt?.toISOString() ?? null,
  };
}

export function toBookingListItem(booking: Booking): BookingListItem {
  return {
    id: booking.id,
    bookingReference: booking.bookingReference,
    type: booking.type,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    startDate: formatDateOnly(booking.startDate),
    endDate: formatDateOnly(booking.endDate),
    guestCount: booking.guestCount,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    createdAt: booking.createdAt.toISOString(),
  };
}

export function toBookingDetail(
  booking: Booking & { items: BookingItem[]; payments: Payment[] },
): BookingDetail {
  return {
    ...toBookingListItem(booking),
    items: booking.items.map(toBookingItemDetail),
    payments: booking.payments.map(toBookingPaymentSummary),
    cancellationNote: booking.cancellationNote,
  };
}

export function buildPaginationMeta(input: { page: number; limit: number; total: number }) {
  return {
    page: input.page,
    limit: input.limit,
    total: input.total,
    totalPages: Math.max(1, Math.ceil(input.total / input.limit)),
  };
}
