"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_JOURNAL_COPY } from "@/lib/landing/travel-journal";
import { cn } from "@/lib/utils";
import type { JournalStory } from "@/types/journal";

interface JournalFeaturedStoryProps {
  story: JournalStory;
}

function JournalFeaturedStory({ story }: JournalFeaturedStoryProps) {
  const reducedMotion = useReducedMotion();

  return (
    <article data-tj-featured className="group">
      <Link
        href={`/journal/${story.slug}`}
        className="relative block overflow-hidden rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:rounded-[1.75rem] lg:rounded-[2rem]"
        aria-label={`${story.title} — ${story.destination}`}
      >
        <div
          data-tj-image-mask
          className="relative aspect-[4/5] overflow-hidden bg-soft-gray will-change-transform sm:aspect-[16/10] lg:aspect-[21/9]"
        >
          <div
            data-tj-parallax
            data-parallax-speed="slow"
            className="absolute inset-[-8%] will-change-transform"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={story.heroImage}
                alt={story.imageAlt}
                fill
                priority
                sizes="100vw"
                quality={85}
                className={cn("object-cover", story.objectPosition ?? "object-center")}
              />
            </motion.div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5"
          />

          <div
            data-tj-featured-overlay
            className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 xl:p-12"
          >
            <span
              data-tj-story-index
              aria-hidden="true"
              className="section-heading pointer-events-none absolute right-6 top-6 text-[4.5rem] leading-none text-white/15 sm:right-8 sm:top-8 sm:text-[6rem] lg:text-[7rem]"
            >
              01
            </span>

            <div className="relative flex max-w-3xl flex-col gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  data-tj-category
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"
                >
                  {story.categoryLabel}
                </span>
                <span data-tj-read-label className="text-xs text-white/70">
                  {story.readLabel}
                </span>
              </div>

              <span
                data-tj-location
                className="inline-flex items-center gap-1.5 text-sm text-white/80"
              >
                <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
                {story.destination}
              </span>

              <h3
                data-tj-title
                className="section-heading text-2xl leading-[1.12] text-white sm:text-4xl lg:text-[2.75rem] xl:text-5xl"
              >
                {story.title}
              </h3>

              <p
                data-tj-excerpt
                className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg"
              >
                {story.excerpt}
              </p>

              <motion.span
                data-tj-link
                whileHover={reducedMotion ? undefined : { x: 4, y: -2 }}
                transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white sm:text-base"
              >
                {TRAVEL_JOURNAL_COPY.readStory}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                />
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export { JournalFeaturedStory };
