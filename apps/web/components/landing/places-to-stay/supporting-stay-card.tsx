"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { StayLayoutVariant, StayListItem } from "@/types/stay";

interface SupportingStayCardProps {
  stay: StayListItem;
  index: number;
}

const GRID_PLACEMENT: Record<number, string> = {
  0: "sm:col-span-1 lg:col-span-5 lg:row-span-2",
  1: "sm:col-span-1 lg:col-span-7 lg:col-start-6 lg:row-start-1",
  2: "sm:col-span-2 lg:col-span-7 lg:col-start-6 lg:row-start-2",
};

const IMAGE_ASPECT: Record<StayLayoutVariant, string> = {
  tall: "aspect-[4/5] lg:aspect-auto lg:min-h-[22rem] lg:flex-1",
  wide: "aspect-[16/10]",
  portrait: "aspect-[16/10] lg:aspect-[5/4]",
};

function SupportingStayCard({ stay, index }: SupportingStayCardProps) {
  const reducedMotion = useReducedMotion();
  const layout = stay.layoutVariant ?? "portrait";
  const isTall = layout === "tall";

  return (
    <article
      data-pts-supporting
      data-pts-supporting-index={index}
      className={cn("relative w-full", GRID_PLACEMENT[index])}
    >
      <Link
        href={`/stays/${stay.slug}`}
        className={cn(
          "group flex h-full flex-col gap-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-3.5",
          isTall && "lg:min-h-[28rem]",
        )}
        aria-label={`${stay.name} — ${stay.destination}`}
      >
        <div
          data-pts-image-mask
          className={cn(
            "relative overflow-hidden rounded-[1.25rem] bg-soft-gray will-change-transform sm:rounded-[1.5rem]",
            IMAGE_ASPECT[layout],
          )}
        >
          <div
            data-pts-parallax
            data-parallax-speed={layout === "tall" ? "medium" : "slow"}
            className="absolute inset-[-8%] will-change-transform"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={stay.heroImage}
                alt={stay.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 40vw, 33vw"
                quality={85}
                className={cn("object-cover", stay.objectPosition ?? "object-center")}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 px-0.5 sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
              {stay.propertyTypeLabel}
            </Badge>
            <span
              data-pts-location
              className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm"
            >
              <MapPin aria-hidden="true" className="size-3 shrink-0 text-primary" />
              {stay.destination}
            </span>
          </div>

          <h3
            data-pts-title
            className="text-base font-bold leading-snug text-heading transition-colors group-hover:text-primary sm:text-[1.0625rem]"
          >
            {stay.name}
          </h3>

          <motion.span
            data-pts-link
            whileHover={reducedMotion ? undefined : { x: 2 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary"
          >
            Explore
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            />
          </motion.span>
        </div>
      </Link>
    </article>
  );
}

export { SupportingStayCard };
