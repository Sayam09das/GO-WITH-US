"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { DashboardProfileMenu } from "@/components/account/dashboard/dashboard-profile-menu";
import { Button } from "@/components/ui/button";
import { DASHBOARD_HEADER_COPY } from "@/lib/account";
import { useNotificationUnreadCount } from "@/lib/hooks/use-notification-unread-count";
import { cn } from "@/lib/utils";

function DashboardMobileTopBar() {
  const unreadCount = useNotificationUnreadCount();

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

      <div className="flex items-center gap-1">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-full text-muted-foreground hover:text-heading"
        >
          <Link href="/account/notifications" aria-label={DASHBOARD_HEADER_COPY.notificationsLabel}>
            <Bell aria-hidden="true" className="size-[1.125rem]" />
            {unreadCount > 0 ? (
              <span
                className={cn(
                  "absolute top-1.5 right-1.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-bold leading-none text-primary-foreground",
                  unreadCount > 9 ? "px-1.5" : "",
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>
        </Button>
        <DashboardProfileMenu compact />
      </div>
    </div>
  );
}

export { DashboardMobileTopBar };
