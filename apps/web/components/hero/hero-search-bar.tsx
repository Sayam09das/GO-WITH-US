"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HERO_COPY } from "@/lib/hero";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

function HeroSearchBar() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.45, ease: ENTRANCE_EASE }}
      className={cn(
        "relative z-10 w-full max-w-xl rounded-2xl border border-border/70 bg-card p-2 shadow-md",
        "sm:rounded-[14px] sm:p-2",
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        <div className="booking-item min-h-12 min-w-0 flex-1 rounded-xl border border-border/50 bg-background/80 px-3 py-2.5 sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-3.5 sm:py-0">
          <span className="icon-orange" aria-hidden="true">
            <MapPin className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-heading">
              {HERO_COPY.locationLabel}
            </span>
            <span className="block truncate text-xs text-muted-foreground sm:text-sm">
              {HERO_COPY.locationPlaceholder}
            </span>
          </span>
        </div>

        <div className="booking-item min-h-12 min-w-0 flex-1 rounded-xl border border-border/50 bg-background/80 px-3 py-2.5 sm:min-h-0 sm:rounded-none sm:border-0 sm:border-r sm:bg-transparent sm:px-3.5 sm:py-0">
          <span className="icon-orange" aria-hidden="true">
            <CalendarDays className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-heading">{HERO_COPY.dateLabel}</span>
            <span className="block truncate text-xs text-muted-foreground sm:text-sm">
              {HERO_COPY.datePlaceholder}
            </span>
          </span>
        </div>

        <div className="px-1 pb-0.5 sm:py-0 sm:pl-2 sm:pr-1">
          <Button asChild className="h-11 w-full sm:w-auto">
            <Link href="/search">{HERO_COPY.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export { HeroSearchBar };
