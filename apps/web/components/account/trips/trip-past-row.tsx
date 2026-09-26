"use client";

import type { TripSummary } from "@gowithus/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MY_TRIPS_SECTION_COPY } from "@/lib/account/trips/my-trips-copy";
import {
  countTripNights,
  formatTripDateRange,
  tripCoverImage,
  tripDestinationTitle,
  tripViewHref,
} from "@/lib/account/trips/trip-display";
import { cn } from "@/lib/utils";

interface TripPastRowProps {
  trip: TripSummary;
  showPlanAnother?: boolean;
  className?: string;
}

function TripPastRow({ trip, showPlanAnother = false, className }: TripPastRowProps) {
  const [imageError, setImageError] = useState(false);
  const nights = countTripNights(trip.startDate, trip.endDate);
  const nightsLabel = nights ? `${nights} night${nights === 1 ? "" : "s"}` : "—";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 border-b border-border/60 py-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-[4.5rem]">
        {imageError ? (
          <div className="size-full bg-gradient-to-br from-[#c4b5a5] to-[#5c4a3a]" />
        ) : (
          <Image
            src={tripCoverImage(trip)}
            alt=""
            fill
            sizes="72px"
            onError={() => setImageError(true)}
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-heading">{tripDestinationTitle(trip)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatTripDateRange(trip.startDate, trip.endDate, "compact")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
        <p className="text-sm text-muted-foreground">{nightsLabel}</p>
        <Link
          href={tripViewHref(trip.id)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          {MY_TRIPS_SECTION_COPY.viewTrip}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
        {showPlanAnother ? (
          <Link
            href="/trips/new"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
          >
            {MY_TRIPS_SECTION_COPY.planAnother}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export { TripPastRow };
