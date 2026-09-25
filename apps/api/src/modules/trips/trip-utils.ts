import type { TripStatus } from "../../generated/client.js";

export type TripStatusFilter =
  | "draft"
  | "upcoming"
  | "active"
  | "ongoing"
  | "past"
  | "completed"
  | "cancelled";

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseDateOnly(value: string | Date): Date {
  if (value instanceof Date) {
    return startOfUtcDay(value);
  }

  return startOfUtcDay(new Date(`${value.slice(0, 10)}T00:00:00.000Z`));
}

export function countTripDays(startDate: Date, endDate: Date): number {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  const diffMs = end.getTime() - start.getTime();

  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function addDaysToDate(date: Date, days: number): Date {
  const next = parseDateOnly(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeTripStatus(input: {
  status: TripStatus;
  startDate: Date | null;
  endDate: Date | null;
}): TripStatus {
  if (input.status === "cancelled") {
    return "cancelled";
  }

  if (!input.startDate || !input.endDate) {
    return "draft";
  }

  const today = startOfUtcDay(new Date());
  const start = parseDateOnly(input.startDate);
  const end = parseDateOnly(input.endDate);

  if (today < start) {
    return "upcoming";
  }

  if (today > end) {
    return "completed";
  }

  return "active";
}

export function shouldPersistStatus(
  currentStatus: TripStatus,
  computedStatus: TripStatus,
): boolean {
  if (currentStatus === "cancelled") {
    return false;
  }

  return currentStatus !== computedStatus;
}

export function mapStatusFilter(filter: TripStatusFilter): TripStatus | "past" {
  switch (filter) {
    case "ongoing":
      return "active";
    case "past":
      return "past";
    case "completed":
      return "completed";
    default:
      return filter;
  }
}

export function parseTimeString(value: string): Date {
  const [hours, minutes] = value.split(":").map((part) => Number.parseInt(part, 10));
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
}

export function formatTimeString(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const hours = value.getUTCHours().toString().padStart(2, "0");
  const minutes = value.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function inferTimeSlot(time: string): "morning" | "afternoon" | "evening" {
  const hour = Number.parseInt(time.split(":")[0] ?? "0", 10);

  if (hour < 12) {
    return "morning";
  }

  if (hour < 17) {
    return "afternoon";
  }

  return "evening";
}
