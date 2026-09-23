import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EXPLORE_SECTION_COPY, EXPLORE_SECTION_LINKS } from "@/lib/account";

function DashboardExploreHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="max-w-xl flex flex-col gap-2 sm:gap-2.5">
        <p
          data-dash-explore-reveal
          className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground will-change-transform"
        >
          {EXPLORE_SECTION_COPY.eyebrow}
        </p>
        <h2
          id="dashboard-explore-heading"
          data-dash-explore-reveal
          className="hero-heading text-2xl font-semibold tracking-tight text-heading will-change-transform sm:text-[1.75rem]"
        >
          {EXPLORE_SECTION_COPY.heading}
        </h2>
        <p
          data-dash-explore-reveal
          className="text-sm leading-relaxed text-muted-foreground will-change-transform sm:text-base"
        >
          {EXPLORE_SECTION_COPY.supporting}
        </p>
      </div>

      <Link
        href={EXPLORE_SECTION_LINKS.viewAll}
        data-dash-explore-reveal
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-heading transition-colors will-change-transform hover:text-primary"
      >
        {EXPLORE_SECTION_COPY.viewAll}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

export { DashboardExploreHeader };
