"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { PLACES_TO_STAY_COPY } from "@/lib/landing/places-to-stay";
import { cn } from "@/lib/utils";
import type { StayListItem } from "@/types/stay";

interface FeaturedStayProps {
  stay: StayListItem;
}

function FeaturedStay({ stay }: FeaturedStayProps) {
  const reducedMotion = useReducedMotion();

  return (
    <article data-pts-featured className="group">
      <Link
        href={`/stays/${stay.slug}`}
        className="flex flex-col gap-5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-6"
        aria-label={`${stay.name} — ${stay.destination}`}
      >
        <div
          data-pts-image-mask
          className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-soft-gray will-change-transform sm:aspect-[16/10] sm:rounded-[1.75rem] lg:aspect-[21/9] lg:rounded-[2rem]"
        >
          <div
            data-pts-parallax
            data-parallax-speed="slow"
            className="absolute inset-[-8%] will-change-transform"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={stay.heroImage}
                alt={stay.imageAlt}
                fill
                priority
                sizes="100vw"
                quality={85}
                className={cn("object-cover", stay.objectPosition ?? "object-center")}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:max-w-2xl sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
              {stay.propertyTypeLabel}
            </Badge>
            <span
              data-pts-location
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              {stay.destination}
            </span>
          </div>

          <h3
            data-pts-title
            className="text-2xl font-bold leading-snug tracking-tight text-heading transition-colors group-hover:text-primary sm:text-3xl lg:text-[2rem]"
          >
            {stay.name}
          </h3>

          <p
            data-pts-description
            className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:max-w-xl"
          >
            {stay.description}
          </p>

          <motion.span
            data-pts-link
            whileHover={reducedMotion ? undefined : { x: 2, y: -2 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary sm:text-base"
          >
            {PLACES_TO_STAY_COPY.exploreStay}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            />
          </motion.span>
        </div>
      </Link>
    </article>
  );
}

export { FeaturedStay };
