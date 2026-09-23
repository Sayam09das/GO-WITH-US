"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DASHBOARD_HERO_COPY, DASHBOARD_HERO_LINKS } from "@/lib/account";

function DashboardHeroContent() {
  return (
    <div className="flex max-w-lg flex-col gap-4 sm:gap-5">
      <p
        data-dash-hero-copy
        className="text-sm leading-relaxed text-muted-foreground will-change-transform sm:text-base"
      >
        {DASHBOARD_HERO_COPY.supporting}
      </p>

      <div
        data-dash-hero-copy
        className="flex flex-wrap items-center gap-3 pt-1 will-change-transform sm:gap-4"
      >
        <Button asChild className="rounded-full px-5">
          <Link href={DASHBOARD_HERO_LINKS.explore}>
            {DASHBOARD_HERO_COPY.primaryAction}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-full px-4 text-heading">
          <Link href={DASHBOARD_HERO_LINKS.trips}>{DASHBOARD_HERO_COPY.secondaryAction}</Link>
        </Button>
      </div>
    </div>
  );
}

export { DashboardHeroContent };
