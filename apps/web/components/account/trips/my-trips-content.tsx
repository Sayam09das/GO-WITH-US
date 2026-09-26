"use client";

import type { TripSummary } from "@gowithus/types";
import { CalendarDays, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MyTripsBottomCta } from "@/components/account/trips/my-trips-bottom-cta";
import { TripIncludesPreview } from "@/components/account/trips/trip-includes-preview";
import { TripPastRow } from "@/components/account/trips/trip-past-row";
import { TripUpcomingCard } from "@/components/account/trips/trip-upcoming-card";
import { TripsTabNav } from "@/components/account/trips/trips-tab-nav";
import { EmptyState } from "@/components/states";
import type { MyTripsTabId } from "@/lib/account/trips/my-trips-copy";
import { MY_TRIPS_EMPTY_COPY, MY_TRIPS_SECTION_COPY } from "@/lib/account/trips/my-trips-copy";
import {
  buildTripIncludesFromItemTypes,
  partitionTripsByTab,
  type TripIncludesCounts,
} from "@/lib/account/trips/trip-display";
import { ApiRequestError } from "@/lib/api/client";
import { getTrip, listTrips } from "@/lib/api/trips";

const EMPTY_INCLUDES: TripIncludesCounts = {
  stay: 0,
  experience: 0,
  restaurant: 0,
  places: 0,
};

function MyTripsContent() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [activeTab, setActiveTab] = useState<MyTripsTabId>("upcoming");
  const [includes, setIncludes] = useState<TripIncludesCounts>(EMPTY_INCLUDES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const partitioned = useMemo(() => partitionTripsByTab(trips), [trips]);
  const tabCounts = useMemo(
    () => ({
      upcoming: partitioned.upcoming.length,
      past: partitioned.past.length,
      cancelled: partitioned.cancelled.length,
    }),
    [partitioned],
  );
  const visibleTrips = partitioned[activeTab];
  const primaryUpcoming = partitioned.upcoming[0];

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

  useEffect(() => {
    if (!primaryUpcoming) {
      setIncludes(EMPTY_INCLUDES);
      return;
    }

    let cancelled = false;

    void getTrip(primaryUpcoming.id)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        const types = detail.days.flatMap((day) => day.items.map((item) => item.type));
        setIncludes(buildTripIncludesFromItemTypes(types));
      })
      .catch(() => {
        if (!cancelled) {
          setIncludes(EMPTY_INCLUDES);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [primaryUpcoming]);

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

  return (
    <>
      <TripsTabNav activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

      <div
        role="tabpanel"
        id={`trips-panel-${activeTab}`}
        aria-labelledby={`trips-tab-${activeTab}`}
        className="flex flex-col gap-8"
      >
        {activeTab === "upcoming" ? (
          visibleTrips.length === 0 ? (
            <EmptyState
              title={MY_TRIPS_EMPTY_COPY.upcoming.title}
              description={MY_TRIPS_EMPTY_COPY.upcoming.description}
              icon={CalendarDays}
              action={{
                href: MY_TRIPS_EMPTY_COPY.upcoming.href,
                label: MY_TRIPS_EMPTY_COPY.upcoming.action,
              }}
            />
          ) : (
            <>
              <div className="flex flex-col gap-8">
                {visibleTrips.map((trip, index) => (
                  <TripUpcomingCard key={trip.id} trip={trip} showOverlayLabel={index === 0} />
                ))}
              </div>
              {primaryUpcoming ? <TripIncludesPreview counts={includes} className="mt-2" /> : null}
            </>
          )
        ) : null}

        {activeTab === "past" ? (
          visibleTrips.length === 0 ? (
            <EmptyState
              title={MY_TRIPS_EMPTY_COPY.past.title}
              description={MY_TRIPS_EMPTY_COPY.past.description}
              icon={CalendarDays}
              action={{
                href: "/account/discover",
                label: "Explore destinations",
              }}
            />
          ) : (
            <section aria-labelledby="past-journeys-heading">
              <h2
                id="past-journeys-heading"
                className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                {MY_TRIPS_SECTION_COPY.pastHeading}
              </h2>
              <div className="rounded-[1.25rem] border border-border/60 bg-card px-5 sm:px-6">
                {visibleTrips.map((trip) => (
                  <TripPastRow key={trip.id} trip={trip} showPlanAnother />
                ))}
              </div>
            </section>
          )
        ) : null}

        {activeTab === "cancelled" ? (
          visibleTrips.length === 0 ? (
            <EmptyState
              title={MY_TRIPS_EMPTY_COPY.cancelled.title}
              description={MY_TRIPS_EMPTY_COPY.cancelled.description}
              icon={CalendarDays}
            />
          ) : (
            <div className="rounded-[1.25rem] border border-border/60 bg-card px-5 sm:px-6">
              {visibleTrips.map((trip) => (
                <TripPastRow key={trip.id} trip={trip} />
              ))}
            </div>
          )
        ) : null}
      </div>

      <MyTripsBottomCta />
    </>
  );
}

export { MyTripsContent };
