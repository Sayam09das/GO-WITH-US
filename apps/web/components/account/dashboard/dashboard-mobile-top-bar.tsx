"use client";

import Link from "next/link";
import { DashboardProfileMenu } from "@/components/account/dashboard/dashboard-profile-menu";

function DashboardMobileTopBar() {
  return (
    <div
      data-dash-reveal
      className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-[2px] will-change-transform lg:hidden"
    >
      <Link
        href="/"
        aria-label="GO WITH US — Home"
        className="inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
        >
          G
        </span>
        <span className="hero-heading text-base font-semibold tracking-tight text-heading">
          GO WITH US
        </span>
      </Link>

      <DashboardProfileMenu compact />
    </div>
  );
}

export { DashboardMobileTopBar };
