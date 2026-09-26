"use client";

import type { TripSummary } from "@gowithus/types";
import { CalendarDays, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import {
  ItineraryDraftRow,
  ItineraryUpcomingCard,
} from "@/components/account/itineraries/itinerary-cards";
import { TripPastRow } from "@/components/account/trips/trip-past-row";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import {
  ITINERARIES_BOTTOM_CTA,
  ITINERARIES_EMPTY_COPY,
  ITINERARIES_PAGE_COPY,
  ITINERARIES_TABS,
  type ItinerariesTabId,
} from "@/lib/account/itineraries/itineraries-copy";
import { partitionItinerariesByTab } from "@/lib/account/itineraries/itinerary-display";
import { ApiRequestError } from "@/lib/api/client";
import { listTrips } from "@/lib/api/trips";

function ItinerariesContent() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [activeTab, setActiveTab] = useState<ItinerariesTabId>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const partitioned = useMemo(() => partitionItinerariesByTab(trips), [trips]);
  const tabCounts = useMemo(
    () => ({
      upcoming: partitioned.upcoming.length,
      drafts: partitioned.drafts.length,
      past: partitioned.past.length,
    }),
    [partitioned],
  );
  const visibleTrips = partitioned[activeTab];

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
              setError("Sign in to view your itineraries.");
              return;
            }
            if (cause.status >= 500) {
              setError("We couldn't load your itineraries right now.");
              return;
            }
          }
          setError("We couldn't load your itineraries right now.");
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
        Loading itineraries…
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Itineraries unavailable" description={error} icon={CalendarDays} />;
  }

  const hasAnyTrips = trips.length > 0;

  return (
    <>
      <AccountTabNav
        tabs={ITINERARIES_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: tabCounts[tab.id],
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Itinerary status"
      />

      {!hasAnyTrips ? (
        <EmptyState
          title={ITINERARIES_EMPTY_COPY.all.title}
          description={ITINERARIES_EMPTY_COPY.all.description}
          icon={CalendarDays}
          action={{
            href: ITINERARIES_EMPTY_COPY.all.href,
            label: ITINERARIES_EMPTY_COPY.all.action,
          }}
        />
      ) : visibleTrips.length === 0 ? (
        <EmptyState
          title={ITINERARIES_EMPTY_COPY.tab.title}
          description={ITINERARIES_EMPTY_COPY.tab.description}
          icon={CalendarDays}
          action={{
            href: ITINERARIES_PAGE_COPY.createHref,
            label: ITINERARIES_PAGE_COPY.create,
          }}
        />
      ) : activeTab === "upcoming" ? (
        <div className="flex flex-col gap-8">
          {visibleTrips.map((trip, index) => (
            <ItineraryUpcomingCard key={trip.id} trip={trip} showSectionLabel={index === 0} />
          ))}
        </div>
      ) : activeTab === "drafts" ? (
        <div className="rounded-[1.25rem] border border-border/60 bg-card px-5 sm:px-6">
          {visibleTrips.map((trip) => (
            <ItineraryDraftRow key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.25rem] border border-border/60 bg-card px-5 sm:px-6">
          {visibleTrips.map((trip) => (
            <TripPastRow key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      <section className="mt-14 border-t border-border/60 pt-12 text-center">
        <h2 className="section-heading text-2xl text-heading sm:text-3xl">
          {ITINERARIES_BOTTOM_CTA.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          {ITINERARIES_BOTTOM_CTA.supporting}
        </p>
        <Button asChild className="mt-6 rounded-full px-5">
          <Link href={ITINERARIES_BOTTOM_CTA.href}>{ITINERARIES_BOTTOM_CTA.action}</Link>
        </Button>
      </section>
    </>
  );
}

export { ItinerariesContent };
