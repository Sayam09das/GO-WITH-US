"use client";

import { useRef } from "react";
import { DashboardSavedPlacesCard } from "@/components/account/dashboard/dashboard-saved-places-card";
import { DashboardSavedPlacesEmpty } from "@/components/account/dashboard/dashboard-saved-places-empty";
import { DashboardSavedPlacesHeader } from "@/components/account/dashboard/dashboard-saved-places-header";
import { useDashboardSavedPlacesAnimation } from "@/components/account/dashboard/use-dashboard-saved-places-animation";
import { getSavedPlaces } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardSavedPlacesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const savedPlaces = getSavedPlaces();

  useDashboardSavedPlacesAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-saved-places-heading"
      className={cn(
        "border-t border-border/60 bg-background",
        reducedMotion &&
          "[&_[data-dash-saved-card]]:opacity-100 [&_[data-dash-saved-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-8 sm:gap-10">
          <DashboardSavedPlacesHeader />

          {savedPlaces.length > 0 ? (
            <div className="-mx-1 flex w-full gap-4 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {savedPlaces.map((item, index) => (
                <DashboardSavedPlacesCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <DashboardSavedPlacesEmpty />
          )}
        </div>
      </div>
    </section>
  );
}

export { DashboardSavedPlacesSection };
