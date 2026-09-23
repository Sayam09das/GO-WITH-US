"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { INSPIRATION_SECTION_LINKS } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { JournalStory } from "@/types/journal";

interface DashboardInspirationStoryCardProps {
  story: JournalStory;
}

function DashboardInspirationStoryCard({ story }: DashboardInspirationStoryCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <article
      data-dash-inspiration-card
      className="group flex min-h-[10.5rem] flex-1 will-change-transform"
    >
      <Link
        href={INSPIRATION_SECTION_LINKS.story(story.slug)}
        className="flex min-h-[10.5rem] w-full overflow-hidden rounded-[1.125rem] border border-border/60 bg-card transition-shadow duration-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:min-h-[11rem] sm:rounded-[1.25rem]"
        aria-label={`${story.title}. ${story.readLabel}`}
      >
        <div className="relative w-[42%] shrink-0 self-stretch overflow-hidden sm:w-[40%]">
          <motion.div
            className="absolute inset-0 will-change-transform"
            whileHover={reducedMotion ? undefined : { scale: 1.05 }}
            transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          >
            <Image
              src={story.heroImage}
              alt={story.imageAlt}
              fill
              sizes="(max-width: 1024px) 42vw, 220px"
              quality={85}
              className={cn("object-cover", story.objectPosition ?? "object-center")}
            />
          </motion.div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
          <div className="flex flex-col gap-1.5">
            <p className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {story.categoryLabel}
            </p>
            <motion.h3
              className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-heading sm:text-[1.0625rem]"
              whileHover={reducedMotion ? undefined : { x: 3 }}
              transition={{ duration: 0.24, ease: [0, 0, 0.2, 1] }}
            >
              {story.title}
            </motion.h3>
            <p className="text-xs text-muted-foreground sm:text-sm">{story.readLabel}</p>
          </div>

          <motion.span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center self-end rounded-full border border-border/70 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary"
            whileHover={reducedMotion ? undefined : { x: 2, y: -2 }}
            transition={{ duration: 0.24 }}
          >
            <ArrowUpRight className="size-4" />
          </motion.span>
        </div>
      </Link>
    </article>
  );
}

export { DashboardInspirationStoryCard };
