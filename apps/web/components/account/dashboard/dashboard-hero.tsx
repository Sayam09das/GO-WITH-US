"use client";

import { useRef } from "react";
import { DashboardHeroContent } from "@/components/account/dashboard/dashboard-hero-content";
import { DashboardHeroVisual } from "@/components/account/dashboard/dashboard-hero-visual";
import { useDashboardHeroAnimation } from "@/components/account/dashboard/use-dashboard-hero-animation";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardHeroAnimation(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      aria-label="Your next journey"
      className={cn(
        "border-b border-border/60 bg-background",
        reducedMotion &&
          "[&_[data-dash-hero-copy]]:opacity-100 [&_[data-dash-hero-label]]:opacity-100 [&_[data-dash-hero-visual]]:opacity-100",
      )}
    >
      <div className="container-travel py-6 sm:py-8">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <DashboardHeroContent />
          <DashboardHeroVisual />
        </div>
      </div>
    </section>
  );
}

export { DashboardHero };
