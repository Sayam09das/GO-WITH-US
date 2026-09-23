"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  type DashboardInspirationFeatured,
  INSPIRATION_SECTION_COPY,
  INSPIRATION_SECTION_LINKS,
} from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardInspirationFeaturedProps {
  story: DashboardInspirationFeatured;
}

function DashboardInspirationFeaturedStory({ story }: DashboardInspirationFeaturedProps) {
  const reducedMotion = useReducedMotion();

  return (
    <article
      data-dash-inspiration-featured
      className="group relative h-full min-h-[22rem] overflow-hidden rounded-[1.25rem] will-change-transform sm:min-h-[24rem] sm:rounded-[1.5rem] lg:min-h-[22rem] lg:rounded-[1.75rem]"
    >
      <Link
        href={INSPIRATION_SECTION_LINKS.story(story.slug)}
        className="relative block h-full min-h-[inherit] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${story.title}. ${story.readLabel}`}
      >
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          whileHover={reducedMotion ? undefined : { scale: 1.035 }}
          transition={{ duration: 0.65, ease: [0, 0, 0.2, 1] }}
        >
          <Image
            src={story.heroImage}
            alt={story.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            quality={88}
            className={cn("object-cover", story.objectPosition)}
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/45 to-black/10"
        />

        <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-3 p-6 text-white sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80">
            <span className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.14em] !text-white/90">
              {story.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="!text-white/80">{story.readLabel}</span>
          </div>

          <motion.h3
            className="hero-heading max-w-xl text-2xl font-semibold tracking-tight !text-white sm:text-[1.75rem] lg:text-3xl"
            whileHover={reducedMotion ? undefined : { x: 4 }}
            transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
          >
            {story.title}
          </motion.h3>

          <p className="max-w-lg text-sm leading-relaxed !text-white/80 sm:text-base">
            {story.excerpt}
          </p>

          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 text-sm font-medium !text-white transition-[transform,opacity] duration-300",
              reducedMotion
                ? "opacity-100"
                : "translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            {INSPIRATION_SECTION_COPY.readStory}
            <motion.span
              aria-hidden="true"
              className="inline-flex"
              whileHover={reducedMotion ? undefined : { x: 3 }}
              transition={{ duration: 0.24 }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export { DashboardInspirationFeaturedStory };
