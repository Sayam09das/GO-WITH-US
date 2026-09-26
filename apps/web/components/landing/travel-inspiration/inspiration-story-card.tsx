"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_INSPIRATION_COPY } from "@/lib/landing/travel-inspiration";
import { cn } from "@/lib/utils";
import type { InspirationStory } from "@/types/inspiration";

const FALLBACK_INSPIRATION_IMAGE = "/landingImg/travelimg/travel-1.jpg";

interface InspirationStoryCardProps {
  story: InspirationStory;
  variant?: "compact" | "standard";
  index: number;
}

function InspirationStoryCard({ story, variant = "standard", index }: InspirationStoryCardProps) {
  const reducedMotion = useReducedMotion();
  const isCompact = variant === "compact";
  const imageSrc = story.heroImage?.trim() || FALLBACK_INSPIRATION_IMAGE;

  return (
    <div data-ti-card data-ti-card-index={index} className={cn(!isCompact && "h-full")}>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.45,
          delay: Math.min(index, 4) * 0.05,
          ease: [0, 0, 0.2, 1],
        }}
        whileHover={reducedMotion ? undefined : { y: -3 }}
        className={cn(!isCompact && "h-full")}
      >
        <Card
          className={cn(
            "gap-0 overflow-hidden border-border/70 py-0 shadow-sm transition-shadow duration-200 hover:shadow-md",
            !isCompact && "flex h-full flex-col",
          )}
        >
          <Link
            href={`/inspiration/${story.slug}`}
            className={cn(
              "group flex flex-col focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !isCompact && "h-full",
            )}
            aria-label={`${story.title} — ${story.readLabel}`}
          >
            <div
              data-ti-image-mask
              className={cn(
                "relative w-full shrink-0 overflow-hidden bg-soft-gray",
                isCompact ? "aspect-[16/10]" : "aspect-[4/3]",
              )}
            >
              <motion.div
                className="absolute inset-0 will-change-transform"
                whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
              >
                <Image
                  src={imageSrc}
                  alt={story.imageAlt}
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes={
                    isCompact
                      ? "(max-width: 1024px) 100vw, 22vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  quality={85}
                  className={cn("object-cover", story.objectPosition ?? "object-center")}
                />
              </motion.div>
            </div>

            <CardContent
              className={cn(
                "flex flex-col gap-2 px-4 sm:px-5",
                isCompact ? "py-3.5 sm:py-4" : "flex-1 py-4 sm:py-5",
              )}
            >
              <div className="flex min-h-6 flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
                  {story.category}
                </Badge>
                <span data-ti-read-label className="text-xs text-muted-foreground">
                  {story.readLabel}
                </span>
              </div>

              <h3
                data-ti-title
                className={cn(
                  "line-clamp-2 font-bold leading-snug text-heading transition-colors group-hover:text-primary",
                  isCompact
                    ? "text-base sm:text-[1.0625rem]"
                    : "min-h-[3.25rem] text-base sm:text-lg",
                )}
              >
                {story.title}
              </h3>

              <p
                data-ti-excerpt
                className={cn(
                  "leading-relaxed text-muted-foreground",
                  isCompact ? "line-clamp-2 text-sm" : "line-clamp-3 min-h-[4.125rem] text-sm",
                )}
              >
                {story.excerpt}
              </p>

              <span
                data-ti-link
                className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary"
              >
                {TRAVEL_INSPIRATION_COPY.readStory}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                />
              </span>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}

export { InspirationStoryCard };
