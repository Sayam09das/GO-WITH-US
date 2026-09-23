"use client";

import { useRef } from "react";
import { DashboardInspirationFeaturedStory } from "@/components/account/dashboard/dashboard-inspiration-featured";
import { DashboardInspirationHeader } from "@/components/account/dashboard/dashboard-inspiration-header";
import { DashboardInspirationStoryCard } from "@/components/account/dashboard/dashboard-inspiration-story-card";
import { useDashboardInspirationAnimation } from "@/components/account/dashboard/use-dashboard-inspiration-animation";
import { getDashboardInspiration } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardInspirationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { featured, supporting } = getDashboardInspiration();

  useDashboardInspirationAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-inspiration-heading"
      className={cn(
        "border-t border-border/60 bg-section-warm",
        reducedMotion &&
          "[&_[data-dash-inspiration-card]]:opacity-100 [&_[data-dash-inspiration-featured]]:opacity-100 [&_[data-dash-inspiration-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-8 sm:gap-10">
          <DashboardInspirationHeader />

          <div className="flex flex-col gap-4 lg:min-h-[22rem] lg:flex-row lg:items-stretch lg:gap-5">
            <div className="lg:flex-[1.12]">
              <DashboardInspirationFeaturedStory story={featured} />
            </div>
            <div className="flex flex-col gap-4 lg:flex-1 lg:gap-5">
              {supporting.map((story) => (
                <DashboardInspirationStoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DashboardInspirationSection };
