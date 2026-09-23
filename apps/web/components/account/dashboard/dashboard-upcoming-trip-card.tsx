"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UPCOMING_TRIP_SECTION_COPY, type UpcomingTrip } from "@/lib/account";
import { cn } from "@/lib/utils";

interface DashboardUpcomingTripCardProps {
  trip: UpcomingTrip;
}

function DashboardUpcomingTripCard({ trip }: DashboardUpcomingTripCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <article
      data-dash-upcoming-card
      className="overflow-hidden rounded-2xl border border-border/60 bg-card will-change-transform"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="relative min-h-[13rem] w-full lg:min-h-[17rem] lg:w-[45%] lg:shrink-0">
          <div className="absolute inset-0">
            {hasError ? (
              <div
                role="img"
                aria-label={trip.image.alt}
                className="size-full bg-gradient-to-br from-[#c4b5a5] via-[#8b7355] to-[#5c4a3a]"
              />
            ) : (
              <Image
                src={trip.image.src}
                alt={trip.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={88}
                onError={() => setHasError(true)}
                className={cn("object-cover", trip.image.objectPosition)}
              />
            )}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
          />

          <p className="label-text absolute left-4 top-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:left-5 sm:top-5">
            {UPCOMING_TRIP_SECTION_COPY.overlayLabel}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="hero-heading text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                {trip.destination}
              </h3>
              <p className="text-sm font-medium text-heading sm:text-base">{trip.dateRange}</p>
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                {trip.nightsLabel}
              </p>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              {trip.description}
            </p>

            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-emerald-600/75"
              />
              {trip.statusLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full px-5">
              <Link href={trip.tripHref}>
                {UPCOMING_TRIP_SECTION_COPY.viewTrip}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full px-4 text-heading">
              <Link href={trip.itineraryHref}>{UPCOMING_TRIP_SECTION_COPY.openItinerary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export { DashboardUpcomingTripCard };
