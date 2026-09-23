"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLAN_JOURNEY_LINKS, PLAN_JOURNEY_SECTION_COPY } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

function DashboardPlanJourneyContent() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-1 flex-col justify-center gap-5 p-5 sm:gap-6 sm:p-6 lg:p-8">
      <div className="flex max-w-md flex-col gap-2 sm:gap-2.5">
        <p
          data-dash-plan-reveal
          className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground will-change-transform"
        >
          {PLAN_JOURNEY_SECTION_COPY.eyebrow}
        </p>
        <h2
          id="dashboard-plan-journey-heading"
          data-dash-plan-reveal
          className="text-2xl font-semibold tracking-tight text-heading will-change-transform sm:text-[1.75rem]"
        >
          {PLAN_JOURNEY_SECTION_COPY.heading}
        </h2>
        <p
          data-dash-plan-reveal
          className="text-sm leading-relaxed text-muted-foreground will-change-transform sm:text-[0.9375rem]"
        >
          {PLAN_JOURNEY_SECTION_COPY.supporting}
        </p>
      </div>

      <div data-dash-plan-reveal className="will-change-transform">
        <Button asChild className="rounded-full px-5">
          <Link href={PLAN_JOURNEY_LINKS.explore}>
            {PLAN_JOURNEY_SECTION_COPY.primaryAction}
            <motion.span
              aria-hidden="true"
              className="inline-flex"
              whileHover={reducedMotion ? undefined : { x: 3 }}
              transition={{ duration: 0.24, ease: [0, 0, 0.2, 1] }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { DashboardPlanJourneyContent };
