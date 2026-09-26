"use client";

import type { BookingSummary } from "@gowithus/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  bookingDefaultImage,
  bookingDisplayLocation,
  bookingDisplayTitle,
  bookingStatusLabel,
  bookingTypeLabel,
  formatBookingDateRange,
  formatBookingMeta,
} from "@/lib/account/bookings/booking-display";
import { BOOKINGS_PAGE_COPY } from "@/lib/account/bookings/bookings-copy";
import { cn } from "@/lib/utils";

interface BookingUpcomingCardProps {
  booking: BookingSummary;
  title?: string;
  location?: string;
  onView: (booking: BookingSummary) => void;
  showOverlay?: boolean;
}

function BookingUpcomingCard({
  booking,
  title,
  location,
  onView,
  showOverlay = true,
}: BookingUpcomingCardProps) {
  const [imageError, setImageError] = useState(false);
  const displayTitle = title ?? bookingDisplayTitle(booking);
  const displayLocation = location ?? bookingDisplayLocation(booking);
  const imageSrc = bookingDefaultImage(booking.type);

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative min-h-[14rem] w-full lg:min-h-[18rem] lg:w-[42%] lg:max-w-[45%] lg:shrink-0">
          {imageError ? (
            <div className="size-full min-h-[14rem] bg-gradient-to-br from-[#c4b5a5] to-[#5c4a3a] lg:min-h-[18rem]" />
          ) : (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              onError={() => setImageError(true)}
              className="object-cover"
            />
          )}
          {showOverlay ? (
            <p className="label-text absolute left-4 top-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:left-5 sm:top-5">
              {BOOKINGS_PAGE_COPY.upcomingLabel}
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {bookingTypeLabel(booking.type)}
            </p>
            <h2 className="hero-heading text-xl font-semibold uppercase tracking-[0.04em] text-heading sm:text-2xl">
              {displayTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{displayLocation}</p>
            <p className="text-sm font-medium text-heading">
              {formatBookingDateRange(booking, "long")}
            </p>
            <p className="text-sm text-muted-foreground">{formatBookingMeta(booking)}</p>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-emerald-600/75"
              />
              {bookingStatusLabel(booking.status)}
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Ref. {booking.reference}
            </p>
          </div>

          <Button type="button" className="w-fit rounded-full px-5" onClick={() => onView(booking)}>
            {BOOKINGS_PAGE_COPY.viewBooking}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

interface BookingCompactRowProps {
  booking: BookingSummary;
  title?: string;
  location?: string;
  subdued?: boolean;
  showBookAgain?: boolean;
  onView: (booking: BookingSummary) => void;
}

function BookingCompactRow({
  booking,
  title,
  location,
  subdued = false,
  showBookAgain = false,
  onView,
}: BookingCompactRowProps) {
  const [imageError, setImageError] = useState(false);
  const displayTitle = title ?? bookingDisplayTitle(booking);
  const displayLocation = location ?? bookingDisplayLocation(booking);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 border-b border-border/60 py-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6",
        subdued && "opacity-75",
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-[4.5rem]">
        {imageError ? (
          <div className="size-full bg-muted" />
        ) : (
          <Image
            src={bookingDefaultImage(booking.type)}
            alt=""
            fill
            sizes="72px"
            onError={() => setImageError(true)}
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {bookingTypeLabel(booking.type)}
        </p>
        <h3 className="mt-1 text-base font-semibold text-heading">{displayTitle}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{displayLocation}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatBookingDateRange(booking, "compact")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
        <span className="text-sm text-muted-foreground">{bookingStatusLabel(booking.status)}</span>
        <button
          type="button"
          onClick={() => onView(booking)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          {BOOKINGS_PAGE_COPY.viewDetails}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
        {showBookAgain ? (
          <a
            href={booking.type === "stay" ? "/stays" : "/experiences"}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
          >
            {BOOKINGS_PAGE_COPY.bookAgain}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export { BookingCompactRow, BookingUpcomingCard };
