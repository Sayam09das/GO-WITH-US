"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TOP_DESTINATION_COPY, TOP_DESTINATION_FIELDS } from "@/lib/landing/top-destination";
import { cn } from "@/lib/utils";

function TopDestinationSearchBar() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      data-td-search
      className="w-full max-w-4xl rounded-2xl border border-border/60 bg-card p-2 shadow-lg sm:rounded-[1.125rem] sm:p-2.5 lg:max-w-5xl"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
        {TOP_DESTINATION_FIELDS.map((field, index) => {
          const Icon = field.icon;
          const isLastField = index === TOP_DESTINATION_FIELDS.length - 1;

          return (
            <motion.div
              key={field.id}
              data-td-field
              data-td-field-index={index}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      backgroundColor: "rgba(255, 245, 240, 0.65)",
                    }
              }
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              className={cn(
                "booking-item min-h-12 min-w-0 flex-1 rounded-xl px-3 py-2.5 transition-colors lg:min-h-0 lg:rounded-none lg:px-4 lg:py-3",
                !isLastField && "lg:border-r lg:border-border/70",
              )}
            >
              <span className="icon-orange" aria-hidden="true">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-semibold text-heading">{field.label}</span>
                <span className="block truncate text-xs text-muted-foreground sm:text-sm">
                  {field.placeholder}
                </span>
              </span>
            </motion.div>
          );
        })}

        <div data-td-cta className="px-1 pb-0.5 pt-0.5 sm:px-2 lg:py-0 lg:pl-3 lg:pr-1.5">
          <Button asChild className="h-11 w-full min-w-[9.5rem] lg:w-auto">
            <Link href="/search">{TOP_DESTINATION_COPY.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { TopDestinationSearchBar };
