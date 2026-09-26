"use client";

import type { TripSummary } from "@gowithus/types";
import { CalendarDays, LoaderCircle, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/states";
import { ApiRequestError } from "@/lib/api/client";
import { listTrips } from "@/lib/api/trips";

function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) {
    return "Dates to be confirmed";
  }

  const format = (value: string) =>
    new Date(`${value}T00:00:00.000Z`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!endDate || endDate === startDate) {
    return format(startDate);
  }

  return `${format(startDate)} – ${format(endDate)}`;
}

export function TripsList() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listTrips()
      .then((items) => {
        if (!cancelled) {
          setTrips(items);
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          if (cause instanceof ApiRequestError) {
            if (cause.status === 401) {
              setError("Sign in to view your trips.");
              return;
            }
            if (cause.status >= 500) {
              setError(
                "We couldn't load your trips. Sign out and sign in again, and make sure the API is running locally.",
              );
              return;
            }
          }
          setError("We couldn't load your trips right now.");
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
        Loading trips…
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Trips unavailable" description={error} icon={CalendarDays} />;
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        title="No trips yet"
        description="When you start planning a journey, your draft and upcoming trips will appear here."
        icon={CalendarDays}
        action={{ href: "/trips/new", label: "Plan a trip" }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {trips.map((trip) => (
        <article
          key={trip.id}
          className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-[16/10] w-full sm:aspect-auto sm:min-h-[10rem] sm:w-56">
              <Image
                src={trip.coverImage ?? "/landingImg/travelimg/travel-5.jpg"}
                alt={trip.title}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {trip.status}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-heading">{trip.title}</h2>
                {trip.destination ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {trip.destination}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
              <Link href="/account/itineraries" className="text-sm font-medium text-primary">
                Open itinerary
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
