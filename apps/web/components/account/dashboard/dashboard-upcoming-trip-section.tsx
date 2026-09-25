"use client";

import { useRef } from "react";
import { DashboardUpcomingTripCard } from "@/components/account/dashboard/dashboard-upcoming-trip-card";
import { DashboardUpcomingTripEmpty } from "@/components/account/dashboard/dashboard-upcoming-trip-empty";
import { DashboardUpcomingTripHeader } from "@/components/account/dashboard/dashboard-upcoming-trip-header";
import { useDashboardUpcomingTripAnimation } from "@/components/account/dashboard/use-dashboard-upcoming-trip-animation";
import type { UpcomingTrip } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardUpcomingTripSectionProps {
  trip?: UpcomingTrip | null;
}

function DashboardUpcomingTripSection({ trip = null }: DashboardUpcomingTripSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardUpcomingTripAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-upcoming-trip-heading"
      className={cn(
        "bg-background",
        reducedMotion &&
          "[&_[data-dash-upcoming-card]]:opacity-100 [&_[data-dash-upcoming-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-8 sm:gap-10">
          <DashboardUpcomingTripHeader />
          {trip ? <DashboardUpcomingTripCard trip={trip} /> : <DashboardUpcomingTripEmpty />}
        </div>
      </div>
    </section>
  );
}

export { DashboardUpcomingTripSection };
