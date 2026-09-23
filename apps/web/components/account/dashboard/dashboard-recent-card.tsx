"use client";

import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { RECENTLY_VIEWED_SECTION_COPY, type RecentlyViewedItem } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardRecentCardProps {
  item: RecentlyViewedItem;
}

function DashboardRecentCard({ item }: DashboardRecentCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <article
      data-dash-recent-card
      className="group w-[13.5rem] shrink-0 will-change-transform sm:w-[14.5rem]"
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
      >
        <Link
          href={item.href}
          className="block overflow-hidden rounded-xl border border-border/60 bg-card transition-shadow duration-300 hover:border-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label={`${item.name}, ${item.location}, ${item.country}. ${RECENTLY_VIEWED_SECTION_COPY.viewedRecently}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-soft-gray">
            <motion.div
              className="absolute inset-0 will-change-transform"
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="232px"
                quality={85}
                className={cn("object-cover", item.image.objectPosition)}
              />
            </motion.div>

            <span
              className={cn(
                "absolute right-2.5 top-2.5 inline-flex size-7 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground transition-[transform,opacity,color] duration-300",
                reducedMotion
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
              )}
              aria-hidden="true"
            >
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>

          <div className="flex flex-col gap-2 p-3.5">
            <div className="flex flex-col gap-1">
              <p className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {item.typeLabel}
              </p>
              <h3 className="line-clamp-1 text-sm font-semibold !text-heading">{item.name}</h3>
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin aria-hidden="true" className="size-3 shrink-0" />
                <span className="truncate">
                  {item.location}, {item.country}
                </span>
              </p>
            </div>

            <p className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground/90">
              <Clock3 aria-hidden="true" className="size-3 shrink-0" />
              {RECENTLY_VIEWED_SECTION_COPY.viewedRecently}
            </p>
          </div>
        </Link>
      </motion.div>
    </article>
  );
}

export { DashboardRecentCard };
