import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { UPCOMING_TRIP_LINKS, UPCOMING_TRIP_SECTION_COPY } from "@/lib/account";

function DashboardUpcomingTripHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="max-w-xl flex flex-col gap-2 sm:gap-2.5">
        <p
          data-dash-upcoming-reveal
          className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground will-change-transform"
        >
          {UPCOMING_TRIP_SECTION_COPY.eyebrow}
        </p>
        <h2
          id="dashboard-upcoming-trip-heading"
          data-dash-upcoming-reveal
          className="hero-heading text-2xl font-semibold tracking-tight text-heading will-change-transform sm:text-[1.75rem]"
        >
          {UPCOMING_TRIP_SECTION_COPY.heading}
        </h2>
        <p
          data-dash-upcoming-reveal
          className="text-sm leading-relaxed text-muted-foreground will-change-transform sm:text-base"
        >
          {UPCOMING_TRIP_SECTION_COPY.supporting}
        </p>
      </div>

      <Link
        href={UPCOMING_TRIP_LINKS.allTrips}
        data-dash-upcoming-reveal
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-heading transition-colors will-change-transform hover:text-primary"
      >
        {UPCOMING_TRIP_SECTION_COPY.viewAllTrips}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

export { DashboardUpcomingTripHeader };
