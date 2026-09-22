"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_JOURNAL_COPY } from "@/lib/landing/travel-journal";
import { cn } from "@/lib/utils";
import type { JournalLayoutVariant, JournalStory } from "@/types/journal";

interface JournalSupportingStoryProps {
  story: JournalStory;
  index: number;
}

const GRID_PLACEMENT: Record<number, string> = {
  0: "lg:col-span-7 lg:row-start-1",
  1: "lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1",
  2: "lg:col-span-7 lg:row-start-2",
};

const LINK_CLASSES: Record<JournalLayoutVariant, string> = {
  horizontal: "lg:flex-row lg:items-stretch lg:gap-8",
  tall: "flex-col",
  compact: "lg:flex-row lg:items-center lg:gap-8",
};

const IMAGE_CLASSES: Record<JournalLayoutVariant, string> = {
  horizontal: "aspect-[16/10] lg:aspect-auto lg:min-h-[15rem] lg:w-[48%] lg:shrink-0",
  tall: "aspect-[3/4] lg:min-h-[22rem] lg:flex-1",
  compact: "aspect-[5/4] lg:aspect-[16/10] lg:w-[44%] lg:shrink-0",
};

const STORY_NUMBERS = ["02", "03", "04"];

function JournalSupportingStory({ story, index }: JournalSupportingStoryProps) {
  const reducedMotion = useReducedMotion();
  const layout = story.layoutVariant ?? "compact";
  const storyNumber = STORY_NUMBERS[index] ?? "0";

  return (
    <article
      data-tj-supporting
      data-tj-supporting-index={index}
      className={cn("relative w-full", GRID_PLACEMENT[index])}
    >
      <span
        data-tj-story-index
        aria-hidden="true"
        className={cn(
          "section-heading pointer-events-none absolute -top-3 left-0 z-0 text-[4rem] leading-none text-primary/10 sm:text-[5rem]",
          layout === "tall" && "lg:-left-4 lg:-top-6 lg:text-[6rem]",
        )}
      >
        {storyNumber}
      </span>

      <Link
        href={`/journal/${story.slug}`}
        className={cn(
          "group relative z-10 flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-5",
          LINK_CLASSES[layout],
        )}
        aria-label={`${story.title} — ${story.destination}`}
      >
        <div
          data-tj-image-mask
          className={cn(
            "relative overflow-hidden rounded-[1.25rem] bg-soft-gray will-change-transform sm:rounded-[1.5rem]",
            IMAGE_CLASSES[layout],
            layout === "tall" ? "w-full" : "w-full",
          )}
        >
          <div
            data-tj-parallax
            data-parallax-speed={layout === "tall" ? "medium" : "slow"}
            className="absolute inset-[-8%] will-change-transform"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={story.heroImage}
                alt={story.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                quality={85}
                className={cn("object-cover", story.objectPosition ?? "object-center")}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2.5 pt-1 sm:gap-3 lg:pt-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              data-tj-category
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary"
            >
              {story.categoryLabel}
            </span>
            <span data-tj-read-label className="text-xs text-muted-foreground">
              {story.readLabel}
            </span>
          </div>

          <span
            data-tj-location
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
            {story.destination}
          </span>

          <h3
            data-tj-title
            className="section-heading text-xl leading-[1.2] text-heading transition-colors group-hover:text-primary sm:text-2xl lg:text-[1.75rem]"
          >
            {story.title}
          </h3>

          <p data-tj-excerpt className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {story.excerpt}
          </p>

          <motion.span
            data-tj-link
            whileHover={reducedMotion ? undefined : { x: 3 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="mt-1 inline-flex w-fit items-center gap-1.5 border-b border-primary/30 pb-0.5 text-sm font-semibold text-primary"
          >
            {TRAVEL_JOURNAL_COPY.readStory}
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

export { JournalSupportingStory };
