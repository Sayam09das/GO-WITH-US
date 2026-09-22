"use client";

import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { DestinationListItem } from "@/types/destination";

interface DestinationCardProps {
  destination: DestinationListItem;
  index: number;
}

function DestinationCard({ destination, index }: DestinationCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div data-pd-card data-pd-card-index={index} className="h-full">
      <Link
        href={`/destinations/${destination.slug}`}
        className="group block h-full rounded-[1.25rem] bg-card p-3 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:rounded-[1.375rem] sm:p-3.5"
        aria-label={`${destination.title}, ${destination.location}, ${destination.country}`}
      >
        <div
          data-pd-image-mask
          className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[0.875rem]"
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            whileHover={reducedMotion ? undefined : { scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            <Image
              src={destination.heroImage}
              alt={destination.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              className={cn("object-cover", destination.objectPosition ?? "object-center")}
            />
          </motion.div>

          <div
            data-pd-rating
            className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#3b82f6]/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur-sm"
          >
            <Star aria-hidden="true" className="size-3 fill-[#f5ab14] text-[#f5ab14]" />
            <span>{destination.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 px-0.5 pb-1 pt-4">
          <div className="min-w-0 flex-1">
            <h3
              data-pd-title
              className="truncate text-base font-bold text-heading sm:text-[1.0625rem]"
            >
              {destination.title}
            </h3>
            <p
              data-pd-location
              className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {destination.location}, {destination.country}
              </span>
            </p>
          </div>

          <span data-pd-price className="price-badge shrink-0 px-3 py-1.5 text-sm font-bold">
            {destination.priceLabel}
          </span>
        </div>
      </Link>
    </div>
  );
}

export { DestinationCard };
