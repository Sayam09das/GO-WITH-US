"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HERO_COPY } from "@/lib/hero";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const ENTRANCE_EASE: [number, number, number, number] = [0, 0, 0.2, 1];

function HeroSearchBar() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.45, ease: ENTRANCE_EASE }}
      className="booking-bar relative z-10 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-0"
    >
      <div className="booking-item min-w-0 flex-1 border-r-0 sm:border-r">
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

      <div className="booking-item min-w-0 flex-1 border-r-0 sm:border-r">
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

      <div className="p-1 sm:pl-2">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/search">{HERO_COPY.ctaLabel}</Link>
        </Button>
      </div>
    </motion.div>
  );
}

export { HeroSearchBar };
