"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { WhatWeGiveFeature } from "@/lib/landing/what-we-give";
import { cn } from "@/lib/utils";

interface WhatWeGiveFeatureCardProps {
  feature: WhatWeGiveFeature;
  index: number;
}

function WhatWeGiveFeatureCard({ feature, index }: WhatWeGiveFeatureCardProps) {
  const reducedMotion = useReducedMotion();
  const Icon = feature.icon;
  const highlighted = feature.highlighted === true;

  return (
    <div data-wwg-card data-wwg-highlighted={highlighted ? "true" : undefined} className="h-full">
      <motion.article
        whileHover={
          reducedMotion
            ? undefined
            : {
                y: highlighted ? -6 : -4,
              }
        }
        transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
        className={cn(
          "flex h-full flex-col gap-4 rounded-[1.25rem] bg-card px-5 py-7 shadow-md will-change-transform sm:gap-5 sm:rounded-[1.5rem] sm:px-6 sm:py-8 lg:px-7 lg:py-10",
          highlighted && "min-[640px]:-translate-y-3 min-[640px]:shadow-lg lg:-translate-y-4",
        )}
      >
        <div
          data-wwg-card-icon
          data-wwg-card-index={index}
          className="flex size-12 items-center justify-center rounded-xl bg-soft-orange shadow-xs sm:size-[3.25rem] sm:rounded-2xl"
        >
          <Icon aria-hidden="true" className="size-5 text-primary sm:size-6" strokeWidth={2.25} />
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          <h3
            data-wwg-card-title
            data-wwg-card-index={index}
            className="text-base font-bold leading-snug text-heading sm:text-lg"
          >
            {feature.title}
          </h3>
          <p
            data-wwg-card-desc
            data-wwg-card-index={index}
            className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]"
          >
            {feature.description}
          </p>
        </div>
      </motion.article>
    </div>
  );
}

export { WhatWeGiveFeatureCard };
