"use client";

import type { TripSummary } from "@gowithus/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MY_TRIPS_SECTION_COPY } from "@/lib/account/trips/my-trips-copy";
import {
  formatTripDateRange,
  formatTripMetaLine,
  tripCoverImage,
  tripDestinationLabel,
  tripItineraryHref,
  tripStatusLabel,
  tripViewHref,
} from "@/lib/account/trips/trip-display";
import { cn } from "@/lib/utils";

interface TripUpcomingCardProps {
  trip: TripSummary;
  showOverlayLabel?: boolean;
}

function TripUpcomingCard({ trip, showOverlayLabel = true }: TripUpcomingCardProps) {
  const [imageError, setImageError] = useState(false);
  const cover = tripCoverImage(trip);

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative min-h-[14rem] w-full lg:min-h-[18rem] lg:w-[42%] lg:max-w-[45%] lg:shrink-0">
          {imageError ? (
            <div
              role="img"
              aria-label={tripDestinationLabel(trip)}
              className="size-full min-h-[14rem] bg-gradient-to-br from-[#c4b5a5] via-[#8b7355] to-[#5c4a3a] lg:min-h-[18rem]"
            />
          ) : (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={88}
              onError={() => setImageError(true)}
              className="object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          />
          {showOverlayLabel ? (
            <p className="label-text absolute left-4 top-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:left-5 sm:top-5">
              {MY_TRIPS_SECTION_COPY.upcomingLabel}
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="hero-heading text-xl font-semibold tracking-[0.06em] text-heading sm:text-2xl">
                {tripDestinationLabel(trip)}
              </h2>
              <p className="text-sm font-medium text-heading sm:text-base">
                {formatTripDateRange(trip.startDate, trip.endDate, "long")}
              </p>
              <p className="text-sm text-muted-foreground">{formatTripMetaLine(trip)}</p>
            </div>

            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  trip.status === "cancelled" ? "bg-muted-foreground/50" : "bg-emerald-600/75",
                )}
              />
              {tripStatusLabel(trip.status)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full px-5">
              <Link href={tripViewHref(trip.id)}>
                {MY_TRIPS_SECTION_COPY.viewTrip}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full px-4 text-heading">
              <Link href={tripItineraryHref(trip.id)}>{MY_TRIPS_SECTION_COPY.openItinerary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export { TripUpcomingCard };
