import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RECENTLY_VIEWED_LINKS, RECENTLY_VIEWED_SECTION_COPY } from "@/lib/account";

function DashboardRecentHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
      <div className="max-w-lg flex flex-col gap-1.5 sm:gap-2">
        <p
          data-dash-recent-reveal
          className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground will-change-transform"
        >
          {RECENTLY_VIEWED_SECTION_COPY.eyebrow}
        </p>
        <h2
          id="dashboard-recent-heading"
          data-dash-recent-reveal
          className="text-xl font-semibold tracking-tight text-heading will-change-transform sm:text-[1.375rem]"
        >
          {RECENTLY_VIEWED_SECTION_COPY.heading}
        </h2>
        <p
          data-dash-recent-reveal
          className="text-sm leading-relaxed text-muted-foreground will-change-transform"
        >
          {RECENTLY_VIEWED_SECTION_COPY.supporting}
        </p>
      </div>

      <Link
        href={RECENTLY_VIEWED_LINKS.history}
        data-dash-recent-reveal
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors will-change-transform hover:text-heading"
      >
        {RECENTLY_VIEWED_SECTION_COPY.viewHistory}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

export { DashboardRecentHeader };
