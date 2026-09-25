"use client";

import { useRef } from "react";
import { DashboardRecentCard } from "@/components/account/dashboard/dashboard-recent-card";
import { DashboardRecentEmpty } from "@/components/account/dashboard/dashboard-recent-empty";
import { DashboardRecentHeader } from "@/components/account/dashboard/dashboard-recent-header";
import { useDashboardRecentAnimation } from "@/components/account/dashboard/use-dashboard-recent-animation";
import type { RecentlyViewedItem } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardRecentSectionProps {
  items?: RecentlyViewedItem[];
}

function DashboardRecentSection({ items = [] }: DashboardRecentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardRecentAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dashboard-recent-heading"
      className={cn(
        "border-t border-border/60 bg-background",
        reducedMotion &&
          "[&_[data-dash-recent-card]]:opacity-100 [&_[data-dash-recent-reveal]]:opacity-100",
      )}
    >
      <div className="container-travel py-8 sm:py-10">
        <div className="flex flex-col gap-5 sm:gap-6">
          <DashboardRecentHeader />

          {items.length > 0 ? (
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3.5 [&::-webkit-scrollbar]:hidden">
              {items.map((item) => (
                <DashboardRecentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <DashboardRecentEmpty />
          )}
        </div>
      </div>
    </section>
  );
}

export { DashboardRecentSection };
