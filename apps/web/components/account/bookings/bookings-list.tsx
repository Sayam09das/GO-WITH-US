"use client";

import type { BookingSummary } from "@gowithus/types";
import { CalendarDays, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/states";
import { listBookings } from "@/lib/api/bookings";
import { ApiRequestError } from "@/lib/api/client";

function formatDate(value: string | null): string {
  if (!value) {
    return "Dates to be confirmed";
  }

  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BookingsList() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listBookings()
      .then((items) => {
        if (!cancelled) {
          setBookings(items);
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          if (cause instanceof ApiRequestError && cause.status === 401) {
            setError("Sign in to view your bookings.");
            return;
          }

          setError("We couldn't load your bookings right now.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading bookings…
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Bookings unavailable" description={error} icon={CalendarDays} />;
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="When you reserve a stay or experience, it will appear here with status and dates."
        icon={CalendarDays}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <article
          key={booking.id}
          className="rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {booking.type}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-heading">{booking.reference}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(booking.startDate)}
                {booking.endDate && booking.endDate !== booking.startDate
                  ? ` – ${formatDate(booking.endDate)}`
                  : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-heading">
                {formatAmount(booking.totalAmount, booking.currency)}
              </p>
              <p className="mt-1 text-xs capitalize text-muted-foreground">
                {booking.status} · {booking.paymentStatus}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
