"use client";

import { useRef } from "react";
import { DashboardExploreHeader } from "@/components/account/dashboard/dashboard-explore-header";
import { DashboardExplorePanel } from "@/components/account/dashboard/dashboard-explore-panel";
import { useDashboardExploreAnimation } from "@/components/account/dashboard/use-dashboard-explore-animation";
import { getExploreDestinations } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardExploreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const destinations = getExploreDestinations();

  useDashboardExploreAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-explore-heading"
      className={cn(
        "bg-background",
        reducedMotion &&
          "[&_[data-dash-explore-panel]]:opacity-100 [&_[data-dash-explore-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-8 sm:gap-10">
          <DashboardExploreHeader />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
            {destinations.map((destination) => (
              <DashboardExplorePanel key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { DashboardExploreSection };
