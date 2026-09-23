"use client";

import { ArrowRight, Bookmark, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { SAVED_PLACES_SECTION_COPY, type SavedPlaceItem } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardSavedPlacesCardProps {
  item: SavedPlaceItem;
  index: number;
}

function DashboardSavedPlacesCard({ item, index }: DashboardSavedPlacesCardProps) {
  const reducedMotion = useReducedMotion();
  const [isSaved, setIsSaved] = useState(true);

  return (
    <article
      data-dash-saved-card
      className={cn(
        "group flex w-[17.5rem] shrink-0 flex-col will-change-transform sm:w-[19rem] lg:w-auto lg:min-w-0",
        index === 0 ? "lg:flex-[1.12]" : "lg:flex-1",
      )}
    >
      <div className="relative overflow-hidden rounded-t-[1.125rem]">
        <Link
          href={item.href}
          className="relative block aspect-[4/5] overflow-hidden focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${item.name}, ${item.location}, ${item.country}`}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            whileHover={reducedMotion ? undefined : { scale: 1.045 }}
            transition={{ duration: 0.65, ease: [0, 0, 0.2, 1] }}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 1024px) 304px, 360px"
              quality={88}
              className={cn("object-cover", item.image.objectPosition)}
            />
          </motion.div>
        </Link>

        <motion.div
          className="absolute right-3 top-3 z-10"
          whileHover={reducedMotion ? undefined : { scale: 1.06 }}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
          transition={{ duration: 0.22 }}
        >
          <IconButton
            variant="ghost"
            label={
              isSaved ? SAVED_PLACES_SECTION_COPY.unsaveLabel : SAVED_PLACES_SECTION_COPY.saveLabel
            }
            icon={Bookmark}
            aria-pressed={isSaved}
            onClick={() => setIsSaved((saved) => !saved)}
            className={cn(
              "size-10 rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white",
              isSaved && "text-primary",
            )}
            iconClassName={cn("size-[1.125rem]", isSaved && "fill-current")}
          />
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-3 rounded-b-[1.125rem] border border-t-0 border-border/60 bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <p className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {item.typeLabel}
          </p>
          <h3 className="hero-heading text-lg font-semibold tracking-tight text-heading sm:text-xl">
            <Link
              href={item.href}
              className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {item.name}
            </Link>
          </h3>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {item.location}, {item.country}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        {item.detail ? <p className="text-sm font-medium text-heading/80">{item.detail}</p> : null}

        <Link
          href={item.href}
          className={cn(
            "mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-heading transition-[transform,opacity] duration-300",
            reducedMotion
              ? "opacity-100"
              : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100",
          )}
        >
          {SAVED_PLACES_SECTION_COPY.explore}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export { DashboardSavedPlacesCard };
