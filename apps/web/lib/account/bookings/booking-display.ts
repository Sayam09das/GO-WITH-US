import type { BookingSummary } from "@gowithus/types";
import { countTripNights, formatTripDateRange } from "@/lib/account/trips/trip-display";
import type { BookingsTabId } from "./bookings-copy";

export type BookingDetailView = {
  id: string;
  reference: string;
  type: BookingSummary["type"];
  status: BookingSummary["status"];
  paymentStatus: BookingSummary["paymentStatus"];
  startDate: string | null;
  endDate: string | null;
  guestCount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  title: string;
  location: string;
  imageSrc: string;
  checkIn: string | null;
  checkOut: string | null;
  cancellationNote: string | null;
  paidAmount: number;
};

const STAY_IMAGE = "/landingImg/hero/hero-resort.jpg";
const EXPERIENCE_IMAGE = "/landingImg/travelimg/travel-8.jpg";

export function bookingDefaultImage(type: BookingSummary["type"]): string {
  return type === "stay" ? STAY_IMAGE : EXPERIENCE_IMAGE;
}

export function bookingTypeLabel(type: BookingSummary["type"]): string {
  return type === "stay" ? "Stay" : "Experience";
}

export function bookingStatusLabel(status: BookingSummary["status"]): string {
  switch (status) {
    case "pending":
      return "Pending confirmation";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
    default:
      return status;
  }
}

export function bookingRefundLabel(paymentStatus: BookingSummary["paymentStatus"]): string {
  if (paymentStatus === "refunded") {
    return "Refund processed";
  }
  if (paymentStatus === "pending") {
    return "Refund pending";
  }
  return "No refund issued";
}

export function formatBookingGuests(count: number): string {
  return `${count} guest${count === 1 ? "" : "s"}`;
}

export function formatBookingMeta(booking: BookingSummary): string {
  const nights = countTripNights(booking.startDate, booking.endDate);
  const guestLine = formatBookingGuests(booking.guestCount);

  if (booking.type === "experience" || !nights) {
    return guestLine;
  }

  return `${guestLine} · ${nights} night${nights === 1 ? "" : "s"}`;
}

export function formatBookingDateRange(
  booking: BookingSummary,
  style: "long" | "compact" = "long",
): string {
  return formatTripDateRange(booking.startDate, booking.endDate, style);
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function bookingDisplayTitle(booking: BookingSummary, roomLabel?: string | null): string {
  if (roomLabel?.trim()) {
    return roomLabel.trim();
  }

  return booking.type === "stay" ? "Reserved stay" : "Reserved experience";
}

export function bookingDisplayLocation(booking: BookingSummary): string {
  return booking.type === "stay" ? "Stay reservation" : "Experience reservation";
}

export function enrichBookingSummary(
  booking: BookingSummary,
  roomLabel?: string | null,
): BookingSummary & { title: string; location: string; imageSrc: string } {
  return {
    ...booking,
    title: bookingDisplayTitle(booking, roomLabel),
    location: bookingDisplayLocation(booking),
    imageSrc: bookingDefaultImage(booking.type),
  };
}

export function partitionBookingsByTab(
  bookings: BookingSummary[],
): Record<BookingsTabId, BookingSummary[]> {
  const cancelled = bookings.filter((b) => b.status === "cancelled" || b.status === "expired");
  const cancelledIds = new Set(cancelled.map((b) => b.id));

  const upcoming = bookings.filter(
    (b) =>
      !cancelledIds.has(b.id) &&
      (b.status === "pending" || b.status === "confirmed") &&
      !isBookingPast(b),
  );

  const completed = bookings.filter(
    (b) =>
      !cancelledIds.has(b.id) &&
      (b.status === "completed" ||
        ((b.status === "pending" || b.status === "confirmed") && isBookingPast(b))),
  );

  return {
    all: bookings,
    upcoming,
    completed,
    cancelled,
  };
}

function isBookingPast(booking: BookingSummary): boolean {
  if (!booking.endDate && !booking.startDate) {
    return false;
  }

  const compare = booking.endDate ?? booking.startDate;
  if (!compare) {
    return false;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Date.parse(`${compare}T00:00:00.000Z`) < today.getTime();
}

export function filterBookingsBySearch(
  bookings: BookingSummary[],
  query: string,
  labels: Map<string, { title: string; location: string }>,
): BookingSummary[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return bookings;
  }

  return bookings.filter((booking) => {
    const label = labels.get(booking.id);
    const haystack = [
      booking.reference,
      booking.type,
      booking.status,
      label?.title,
      label?.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function isUpcomingBooking(booking: BookingSummary): boolean {
  return (
    (booking.status === "pending" || booking.status === "confirmed") && !isBookingPast(booking)
  );
}
