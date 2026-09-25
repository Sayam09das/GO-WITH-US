import type { BookingSummary } from "@gowithus/types";
import { apiFetch } from "./client";

type ApiBookingListItem = {
  id: string;
  bookingReference: string;
  type: "stay" | "experience";
  status: BookingSummary["status"];
  paymentStatus: BookingSummary["paymentStatus"];
  startDate: string | null;
  endDate: string | null;
  totalAmount: number;
  currency: string;
};

type BookingListResponse = {
  items: ApiBookingListItem[];
};

function mapBookingSummary(item: ApiBookingListItem): BookingSummary {
  return {
    id: item.id,
    reference: item.bookingReference,
    type: item.type,
    status: item.status,
    paymentStatus: item.paymentStatus,
    startDate: item.startDate,
    endDate: item.endDate,
    totalAmount: item.totalAmount,
    currency: item.currency,
  };
}

export async function listBookings(
  status?: "upcoming" | "past" | "cancelled",
): Promise<BookingSummary[]> {
  const query = status ? `?status=${status}` : "";
  const response = await apiFetch<BookingListResponse>(`/bookings${query}`);
  return response.items.map(mapBookingSummary);
}

export async function createBooking(input: {
  type: "STAY" | "EXPERIENCE";
  stayId?: string;
  experienceId?: string;
  checkIn?: string;
  checkOut?: string;
  experienceDate?: string;
  startTime?: string;
  guests: { adults: number; children: number };
  idempotencyKey: string;
}): Promise<{ booking: BookingSummary; created: boolean }> {
  const response = await apiFetch<{ booking: ApiBookingListItem; created?: boolean }>("/bookings", {
    method: "POST",
    headers: {
      "Idempotency-Key": input.idempotencyKey,
    },
    body: input,
  });

  return {
    booking: mapBookingSummary(response.booking),
    created: response.created ?? true,
  };
}

export async function cancelBooking(bookingId: string, note?: string): Promise<BookingSummary> {
  const response = await apiFetch<{ booking: ApiBookingListItem }>(
    `/bookings/${bookingId}/cancel`,
    {
      method: "POST",
      body: note ? { note } : {},
    },
  );

  return mapBookingSummary(response.booking);
}
