"use client";

import { Bell } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DashboardProfileMenu } from "@/components/account/dashboard/dashboard-profile-menu";
import { IconButton } from "@/components/ui/icon-button";
import { DASHBOARD_HEADER_COPY } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

function DashboardUtilityBar() {
  const reducedMotion = useReducedMotion();

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
          <IconButton
            variant="ghost"
            label={DASHBOARD_HEADER_COPY.notificationsLabel}
            icon={Bell}
            iconClassName="size-[1.125rem]"
            className="size-10 rounded-full text-muted-foreground hover:text-heading"
          />
        </motion.div>
        <DashboardProfileMenu />
      </div>
    </div>
  );
}

export { DashboardUtilityBar };
