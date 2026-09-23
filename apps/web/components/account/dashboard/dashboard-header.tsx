"use client";

import { useRef } from "react";
import { DashboardMainHeader } from "@/components/account/dashboard/dashboard-main-header";
import { DashboardQuickNav } from "@/components/account/dashboard/dashboard-quick-nav";
import { DashboardUtilityBar } from "@/components/account/dashboard/dashboard-utility-bar";
import { useDashboardHeaderAnimation } from "@/components/account/dashboard/use-dashboard-header-animation";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardHeaderAnimation(headerRef, reducedMotion);

  return (
    <header
      ref={headerRef}
      className={cn("bg-background", reducedMotion && "[&_[data-dash-reveal]]:opacity-100")}
    >
      <div className="container-travel flex flex-col">
        <DashboardUtilityBar />
        <DashboardMainHeader />
        <DashboardQuickNav />
      </div>
    </header>
  );
}

export { DashboardHeader };
