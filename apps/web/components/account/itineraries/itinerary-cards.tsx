"use client";

import type { TripSummary } from "@gowithus/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ITINERARIES_PAGE_COPY } from "@/lib/account/itineraries/itineraries-copy";
import {
  formatTripDateRange,
  itineraryDaysLabel,
  itineraryHref,
  itineraryPlannedLabel,
  itineraryProgress,
  itineraryProgressLabel,
  tripCoverImage,
  tripDestinationLabel,
} from "@/lib/account/itineraries/itinerary-display";

interface ItineraryUpcomingCardProps {
  trip: TripSummary;
  showSectionLabel?: boolean;
}

function ItineraryUpcomingCard({ trip, showSectionLabel = true }: ItineraryUpcomingCardProps) {
  const [imageError, setImageError] = useState(false);
  const progress = itineraryProgress(trip);

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        <div className="relative min-h-[14rem] w-full lg:min-h-[18rem] lg:w-[42%] lg:max-w-[45%] lg:shrink-0">
          {imageError ? (
            <div className="size-full min-h-[14rem] bg-gradient-to-br from-[#c4b5a5] to-[#5c4a3a] lg:min-h-[18rem]" />
          ) : (
            <Image
              src={tripCoverImage(trip)}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              onError={() => setImageError(true)}
              className="object-cover"
            />
          )}
          {showSectionLabel ? (
            <p className="label-text absolute left-4 top-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:left-5 sm:top-5">
              {ITINERARIES_PAGE_COPY.upcomingLabel}
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3">
            <h2 className="hero-heading text-xl font-semibold uppercase tracking-[0.06em] text-heading sm:text-2xl">
              {tripDestinationLabel(trip)}
            </h2>
            <p className="text-sm font-medium text-heading">
              {formatTripDateRange(trip.startDate, trip.endDate, "long")}
            </p>
            <p className="text-sm text-muted-foreground">{itineraryDaysLabel(trip)}</p>
            <p className="text-sm text-muted-foreground">{itineraryPlannedLabel(trip)}</p>

            <div className="mt-2 max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{itineraryProgressLabel(trip)}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <Button asChild className="w-fit rounded-full px-5">
            <Link href={itineraryHref(trip.id)}>
              {ITINERARIES_PAGE_COPY.openItinerary}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

interface ItineraryDraftRowProps {
  trip: TripSummary;
}

function ItineraryDraftRow({ trip }: ItineraryDraftRowProps) {
  return (
    <article className="flex flex-col gap-3 border-b border-border/60 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-heading">{tripDestinationLabel(trip)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft · {itineraryDaysLabel(trip)} · {itineraryPlannedLabel(trip)}
        </p>
      </div>
      <Link
        href={itineraryHref(trip.id)}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {ITINERARIES_PAGE_COPY.continuePlanning}
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </article>
  );
}

export { ItineraryDraftRow, ItineraryUpcomingCard };
