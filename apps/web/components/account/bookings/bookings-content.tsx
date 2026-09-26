"use client";

import type { BookingSummary } from "@gowithus/types";
import { CalendarDays, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import {
  BookingCompactRow,
  BookingUpcomingCard,
} from "@/components/account/bookings/booking-cards";
import { BookingDetailSheet } from "@/components/account/bookings/booking-detail-sheet";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  bookingDisplayLocation,
  bookingDisplayTitle,
  filterBookingsBySearch,
  isUpcomingBooking,
  partitionBookingsByTab,
} from "@/lib/account/bookings/booking-display";
import {
  BOOKINGS_EMPTY_COPY,
  BOOKINGS_PAGE_COPY,
  BOOKINGS_TABS,
  type BookingsTabId,
} from "@/lib/account/bookings/bookings-copy";
import { getBooking, listBookings } from "@/lib/api/bookings";
import { ApiRequestError } from "@/lib/api/client";

function BookingsContent() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [activeTab, setActiveTab] = useState<BookingsTabId>("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [labels, setLabels] = useState<Map<string, { title: string; location: string }>>(
    () => new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const partitioned = useMemo(() => partitionBookingsByTab(bookings), [bookings]);
  const tabCounts = useMemo(
    () => ({
      all: partitioned.all.length,
      upcoming: partitioned.upcoming.length,
      completed: partitioned.completed.length,
      cancelled: partitioned.cancelled.length,
    }),
    [partitioned],
  );

  const visibleBookings = useMemo(() => {
    const base = partitioned[activeTab];
    return filterBookingsBySearch(base, search, labels);
  }, [activeTab, partitioned, search, labels]);

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

  useEffect(() => {
    if (bookings.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      bookings.map(async (booking) => {
        try {
          const detail = await getBooking(booking.id);
          const roomLabel = detail.items[0]?.roomLabel;
          return [
            booking.id,
            {
              title: bookingDisplayTitle(booking, roomLabel),
              location: bookingDisplayLocation(booking),
            },
          ] as const;
        } catch {
          return [
            booking.id,
            {
              title: bookingDisplayTitle(booking),
              location: bookingDisplayLocation(booking),
            },
          ] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setLabels(new Map(entries));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [bookings]);

  function openBooking(booking: BookingSummary) {
    setSelectedBooking(booking);
    setDetailOpen(true);
  }

  function handleBookingUpdated(updated: BookingSummary) {
    setBookings((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

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

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AccountTabNav
          tabs={BOOKINGS_TABS.map((tab) => ({
            id: tab.id,
            label: tab.label,
            count: tabCounts[tab.id],
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Booking status"
          className="mb-0 flex-1"
        />
        <div className="relative w-full lg:max-w-xs">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={BOOKINGS_PAGE_COPY.searchPlaceholder}
            className="rounded-full pl-9"
            aria-label={BOOKINGS_PAGE_COPY.searchPlaceholder}
          />
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="flex flex-col gap-8"
      >
        {bookings.length === 0 ? (
          <EmptyState
            title={BOOKINGS_EMPTY_COPY.all.title}
            description={BOOKINGS_EMPTY_COPY.all.description}
            icon={CalendarDays}
            action={{
              href: BOOKINGS_EMPTY_COPY.all.href,
              label: BOOKINGS_EMPTY_COPY.all.action,
            }}
          />
        ) : visibleBookings.length === 0 ? (
          <EmptyState
            title={BOOKINGS_EMPTY_COPY.category.title}
            description={BOOKINGS_EMPTY_COPY.category.description}
            icon={CalendarDays}
          />
        ) : (
          <>
            {visibleBookings.filter(isUpcomingBooking).map((booking, index) => (
              <BookingUpcomingCard
                key={booking.id}
                booking={booking}
                title={labels.get(booking.id)?.title}
                location={labels.get(booking.id)?.location}
                showOverlay={index === 0 && activeTab !== "all"}
                onView={openBooking}
              />
            ))}
            {visibleBookings.filter((booking) => !isUpcomingBooking(booking)).length > 0 ? (
              <div className="rounded-[1.25rem] border border-border/60 bg-card px-5 sm:px-6">
                {visibleBookings
                  .filter((booking) => !isUpcomingBooking(booking))
                  .map((booking) => (
                    <BookingCompactRow
                      key={booking.id}
                      booking={booking}
                      title={labels.get(booking.id)?.title}
                      location={labels.get(booking.id)?.location}
                      subdued={booking.status === "cancelled" || booking.status === "expired"}
                      showBookAgain={booking.status === "completed"}
                      onView={openBooking}
                    />
                  ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <section className="mt-14 border-t border-border/60 pt-12 text-center">
        <h2 className="section-heading text-2xl text-heading sm:text-3xl">
          {BOOKINGS_PAGE_COPY.bottomCta.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          {BOOKINGS_PAGE_COPY.bottomCta.supporting}
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-full px-5">
          <Link href={BOOKINGS_PAGE_COPY.bottomCta.href}>
            {BOOKINGS_PAGE_COPY.bottomCta.action}
          </Link>
        </Button>
      </section>

      <BookingDetailSheet
        booking={selectedBooking}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onBookingUpdated={handleBookingUpdated}
      />
    </>
  );
}

export { BookingsContent };
