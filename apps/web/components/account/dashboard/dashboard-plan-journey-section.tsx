"use client";

import { useRef } from "react";
import { DashboardPlanJourneyContent } from "@/components/account/dashboard/dashboard-plan-journey-content";
import { DashboardPlanJourneyVisual } from "@/components/account/dashboard/dashboard-plan-journey-visual";
import { useDashboardPlanJourneyAnimation } from "@/components/account/dashboard/use-dashboard-plan-journey-animation";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardPlanJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardPlanJourneyAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-plan-journey-heading"
      className={cn(
        "border-t border-border/60 bg-background",
        reducedMotion &&
          "[&_[data-dash-plan-image-inner]]:scale-100 [&_[data-dash-plan-panel]]:opacity-100 [&_[data-dash-plan-reveal]]:opacity-100 [&_[data-dash-plan-visual]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <article
          data-dash-plan-panel
          className="overflow-hidden rounded-2xl border border-border/60 bg-card will-change-transform sm:rounded-[1.25rem]"
        >
          <div className="flex flex-col lg:flex-row">
            <DashboardPlanJourneyVisual />
            <DashboardPlanJourneyContent />
          </div>
        </article>
      </div>
    </section>
  );
}

export { DashboardPlanJourneySection };
