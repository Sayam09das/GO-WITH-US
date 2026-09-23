import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SAVED_PLACES_LINKS, SAVED_PLACES_SECTION_COPY } from "@/lib/account";

function DashboardSavedPlacesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="max-w-xl flex flex-col gap-2 sm:gap-2.5">
        <p
          data-dash-saved-reveal
          className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground will-change-transform"
        >
          {SAVED_PLACES_SECTION_COPY.eyebrow}
        </p>
        <h2
          id="dashboard-saved-places-heading"
          data-dash-saved-reveal
          className="hero-heading text-2xl font-semibold tracking-tight text-heading will-change-transform sm:text-[1.75rem]"
        >
          {SAVED_PLACES_SECTION_COPY.heading}
        </h2>
        <p
          data-dash-saved-reveal
          className="text-sm leading-relaxed text-muted-foreground will-change-transform sm:text-base"
        >
          {SAVED_PLACES_SECTION_COPY.supporting}
        </p>
      </div>

      <Link
        href={SAVED_PLACES_LINKS.viewAll}
        data-dash-saved-reveal
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-heading transition-colors will-change-transform hover:text-primary"
      >
        {SAVED_PLACES_SECTION_COPY.viewAll}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

export { DashboardSavedPlacesHeader };
