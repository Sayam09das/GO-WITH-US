"use client";

import { useRef } from "react";
import { DashboardHeader } from "@/components/account/dashboard/dashboard-header";
import { DashboardMobileTabBar } from "@/components/account/dashboard/dashboard-mobile-tab-bar";
import { DashboardMobileTopBar } from "@/components/account/dashboard/dashboard-mobile-top-bar";
import { DashboardSidebar } from "@/components/account/dashboard/dashboard-sidebar";
import { DashboardUserProvider } from "@/components/account/dashboard/dashboard-user-context";
import { useDashboardHeaderAnimation } from "@/components/account/dashboard/use-dashboard-header-animation";
import { DASHBOARD_SIDEBAR_OFFSET_CLASS, type DashboardUser } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user: DashboardUser;
}

function DashboardShell({ children, user }: DashboardShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useDashboardHeaderAnimation(shellRef, reducedMotion);

  return (
    <DashboardUserProvider user={user}>
      <div
        ref={shellRef}
        className={cn(
          "min-h-screen bg-background",
          reducedMotion && "[&_[data-dash-reveal]]:opacity-100",
        )}
      >
        <DashboardSidebar className="hidden lg:flex" />

        <div className={cn("flex min-h-screen flex-col", DASHBOARD_SIDEBAR_OFFSET_CLASS)}>
          <DashboardMobileTopBar />
          <DashboardHeader />
          <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
            {children}
          </main>
          <DashboardMobileTabBar />
        </div>
      </div>
    </DashboardUserProvider>
  );
}

export { DashboardShell };
