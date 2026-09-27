"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { StayListItem } from "@/types/stay";

interface PlacesToStayGridCardProps {
  stay: StayListItem;
  index: number;
  eagerLoad?: boolean;
}

function PlacesToStayGridCard({ stay, index, eagerLoad = false }: PlacesToStayGridCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      data-pts-grid-item
      data-pts-grid-index={index}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index % 9, 8) * 0.04, ease: [0, 0, 0.2, 1] }}
      className="group"
    >
      <Link
        href={`/stays/${stay.slug}`}
        className="flex h-full flex-col gap-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-3.5"
        aria-label={`${stay.name} — ${stay.destination}`}
      >
        <div
          data-pts-image-mask
          className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-soft-gray sm:rounded-[1.5rem]"
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              loading={eagerLoad ? "eager" : "lazy"}
              className={cn("object-cover", stay.objectPosition ?? "object-center")}
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-1.5 px-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
              {stay.propertyTypeLabel}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <MapPin aria-hidden="true" className="size-3 shrink-0 text-primary" />
              {stay.destination}
            </span>
          </div>

          <h3 className="line-clamp-2 text-base font-bold leading-snug text-heading transition-colors group-hover:text-primary sm:text-[1.0625rem]">
            {stay.name}
          </h3>

          <span className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary">
            Explore
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export { PlacesToStayGridCard };
