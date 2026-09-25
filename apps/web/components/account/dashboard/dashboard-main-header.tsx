"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardUser } from "@/components/account/dashboard/dashboard-user-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buildDashboardGreeting, DASHBOARD_HEADER_COPY } from "@/lib/account";
import { cn } from "@/lib/utils";

function DashboardMainHeader() {
  const pathname = usePathname();
  const user = useDashboardUser();
  const greeting = buildDashboardGreeting(user.firstName);
  const isOverview = pathname === "/account";

  return (
    <div
      data-dash-reveal
      className={cn(
        "flex flex-col gap-8 py-8 will-change-transform sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        !isOverview && "border-b border-border/60",
      )}
    >
      <div className="flex max-w-2xl flex-col gap-3 sm:gap-4">
        <p className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {DASHBOARD_HEADER_COPY.eyebrow}
        </p>
        <h1 className="hero-heading text-[2rem] font-semibold leading-[1.08] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
          {greeting}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {DASHBOARD_HEADER_COPY.supporting}
        </p>
      </div>

      <div className="hidden items-center gap-4 lg:flex lg:flex-col lg:items-end lg:gap-5">
        <Avatar className="size-14 border border-border/70 bg-primary/5 shadow-xs lg:size-16">
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary lg:text-xl">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <Button asChild variant="outline" size="sm" className="rounded-full px-5">
          <Link href="/account/discover">{DASHBOARD_HEADER_COPY.exploreDestinations}</Link>
        </Button>
      </div>
    </div>
  );
}

export { DashboardMainHeader };
