"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { JourneyStep } from "@/lib/landing/build-your-journey";
import { cn } from "@/lib/utils";

interface JourneyStepCardProps {
  step: JourneyStep;
  index: number;
}

function JourneyStepCard({ step, index }: JourneyStepCardProps) {
  const reducedMotion = useReducedMotion();
  const Icon = step.icon;

  return (
    <div data-byj-step data-byj-step-index={index} className="relative h-full min-h-0">
      <motion.article
        whileHover={reducedMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        className="relative flex h-full flex-col items-center gap-3 rounded-[1.25rem] bg-card/80 px-4 py-5 text-center shadow-sm backdrop-blur-sm will-change-transform sm:gap-3.5 sm:px-5 sm:py-6"
      >
        <span
          data-byj-step-number
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {step.stepNumber}
        </span>

        <div
          data-byj-step-icon
          className="flex size-12 items-center justify-center rounded-2xl bg-soft-orange shadow-xs sm:size-[3.25rem]"
        >
          <Icon aria-hidden="true" className="size-5 text-primary sm:size-6" strokeWidth={2.25} />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h3
            data-byj-step-title
            className="text-base font-bold leading-snug text-heading sm:text-[1.0625rem]"
          >
            {step.label}
          </h3>
          <p
            data-byj-step-desc
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
              "line-clamp-3 min-h-[4.125rem]",
            )}
          >
            {step.description}
          </p>
        </div>
      </motion.article>
    </div>
  );
}

export { JourneyStepCard };
