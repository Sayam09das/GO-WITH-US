"use client";

import { ArrowLeft, LoaderCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddItineraryItemDialog } from "@/components/account/itineraries/add-itinerary-item-dialog";
import { Button } from "@/components/ui/button";
import { formatTripDateRange } from "@/lib/account/itineraries/itinerary-display";
import { ApiRequestError } from "@/lib/api/client";
import { createTripDay, getTrip, type TripDetailResponse } from "@/lib/api/trips";
import { cn } from "@/lib/utils";

function formatTimelineTime(startTime: string | null, timeSlot: string): string {
  if (startTime) {
    return startTime;
  }

  switch (timeSlot) {
    case "morning":
      return "09:30";
    case "afternoon":
      return "14:00";
    case "evening":
      return "18:30";
    default:
      return "—";
  }
}

function ItineraryWorkspace() {
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;
  const [trip, setTrip] = useState<TripDetailResponse | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let detail = await getTrip(tripId);

      if (detail.days.length === 0) {
        await createTripDay(tripId);
        detail = await getTrip(tripId);
      }

      setTrip(detail);
      setActiveDayIndex(detail.days[0]?.dayIndex ?? 1);
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setError("Sign in to view this itinerary.");
      } else {
        setError("We couldn't load this itinerary.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  const activeDay = useMemo(
    () => trip?.days.find((day) => day.dayIndex === activeDayIndex) ?? trip?.days[0],
    [trip, activeDayIndex],
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading itinerary…
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="rounded-[1.25rem] border border-border/60 bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "Itinerary not found."}</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link href="/account/itineraries">Back to itineraries</Link>
        </Button>
      </div>
    );
  }

  const heading =
    trip.destination != null
      ? `${trip.destination.title}, ${trip.destination.country}`
      : trip.title;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 rounded-full px-3">
            <Link href="/account/itineraries">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Itineraries
            </Link>
          </Button>
          <h1 className="hero-heading text-2xl font-semibold text-heading sm:text-3xl">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {formatTripDateRange(trip.startDate, trip.endDate, "long")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="rounded-full" disabled>
            Edit
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" disabled>
            Share
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full" disabled>
            More
          </Button>
        </div>
      </div>

      <nav aria-label="Trip days" className="overflow-x-auto">
        <div className="flex min-w-max gap-2 border-b border-border/60 pb-3">
          {trip.days.map((day) => {
            const isActive = day.dayIndex === activeDay?.dayIndex;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDayIndex(day.dayIndex)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-heading",
                )}
              >
                Day {String(day.dayIndex).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </nav>

      {activeDay ? (
        <section aria-labelledby="day-timeline-heading">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Day {String(activeDay.dayIndex).padStart(2, "0")}
            </p>
            <h2 id="day-timeline-heading" className="mt-2 text-xl font-semibold text-heading">
              {activeDay.title}
            </h2>
          </div>

          {activeDay.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No activities planned for this day yet. Use Add to itinerary below.
            </p>
          ) : (
            <ol className="relative border-l border-border/70 pl-6">
              {activeDay.items.map((item) => (
                <li key={item.id} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[0.4375rem] top-1 size-2 rounded-full bg-primary"
                  />
                  <p className="text-sm font-semibold text-heading">
                    {formatTimelineTime(item.startTime, item.timeSlot)}
                  </p>
                  <p className="mt-1 text-base font-medium text-heading">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {item.type}
                  </p>
                  {item.notes ? (
                    <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      ) : null}

      <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-muted/20 p-6 text-center">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={!activeDay}
          onClick={() => setAddOpen(true)}
        >
          <Plus aria-hidden="true" className="size-4" />
          Add to itinerary
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Destination · Experience · Restaurant · Stay · Custom activity
        </p>
      </div>

      {activeDay ? (
        <AddItineraryItemDialog
          tripId={tripId}
          dayId={activeDay.id}
          open={addOpen}
          onOpenChange={setAddOpen}
          onAdded={() => {
            void loadTrip();
          }}
        />
      ) : null}
    </div>
  );
}

export { ItineraryWorkspace };
