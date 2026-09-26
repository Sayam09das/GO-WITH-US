"use client";

import { Bell } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DashboardProfileMenu } from "@/components/account/dashboard/dashboard-profile-menu";
import { Button } from "@/components/ui/button";
import { DASHBOARD_HEADER_COPY } from "@/lib/account";
import { useNotificationUnreadCount } from "@/lib/hooks/use-notification-unread-count";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DashboardUtilityBar() {
  const reducedMotion = useReducedMotion();
  const unreadCount = useNotificationUnreadCount();

  return (
    <div
      data-dash-reveal
      className="flex items-center justify-between gap-4 border-b border-border/60 py-4 will-change-transform"
    >
      <Link
        href="/"
        aria-label="GO WITH US — Home"
        className="group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs"
        >
          G
        </span>
        <span className="hero-heading text-lg font-semibold tracking-tight text-heading">
          GO WITH US
        </span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <motion.div
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.18 }}
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative size-10 rounded-full text-muted-foreground hover:text-heading"
          >
            <Link
              href="/account/notifications"
              aria-label={DASHBOARD_HEADER_COPY.notificationsLabel}
            >
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
        </motion.div>
        <DashboardProfileMenu />
      </div>
    </div>
  );
}

export { DashboardUtilityBar };
