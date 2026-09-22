"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DiagonalCarousel } from "@/components/ui/diagonal-carousel";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_JOURNAL_COPY } from "@/lib/landing/travel-journal";
import { cn } from "@/lib/utils";
import type { JournalStory } from "@/types/journal";

interface JournalStoryCarouselProps {
  stories: JournalStory[];
}

function JournalStoryCarousel({ stories }: JournalStoryCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideSize, setSlideSize] = useState(240);
  const activeStory = stories[activeIndex] ?? stories[0];

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, stories.length - 1)));
  }, [stories.length]);

  useEffect(() => {
    const updateSlideSize = () => {
      if (window.innerWidth >= 1280) {
        setSlideSize(300);
        return;
      }

      if (window.innerWidth >= 768) {
        setSlideSize(270);
        return;
      }

      setSlideSize(220);
    };

    updateSlideSize();
    window.addEventListener("resize", updateSlideSize);
    return () => window.removeEventListener("resize", updateSlideSize);
  }, []);

  if (!activeStory) {
    return null;
  }

  const carouselItems = stories.map((story) => ({
    id: story.id,
    src: story.heroImage,
    title: story.title,
    alt: story.imageAlt,
  }));

  return (
    <div data-tj-carousel className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
      <div
        className={cn(
          "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
          "h-[26rem] sm:h-[30rem] lg:h-[34rem] xl:h-[36rem]",
        )}
      >
        <DiagonalCarousel
          items={carouselItems}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          loop
          slideSize={slideSize}
          maxVisibleDistance={2}
          rotationStep={26}
          verticalStep={100}
          inactiveScale={0.62}
          className="h-full"
          imageClassName="rounded-[1.25rem] sm:rounded-[1.5rem]"
        />
      </div>

      <div
        data-tj-active-story
        className="relative mx-auto flex w-full max-w-3xl min-h-[14rem] flex-col items-center gap-4 text-center sm:min-h-[15rem] sm:gap-5"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={activeStory.id}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
            className="flex w-full flex-col items-center gap-3 sm:gap-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span
                data-tj-category
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary"
              >
                {activeStory.categoryLabel}
              </span>
              <span data-tj-read-label className="text-xs text-muted-foreground">
                {activeStory.readLabel}
              </span>
            </div>

            <span
              data-tj-location
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              {activeStory.destination}
            </span>

            <h3
              data-tj-title
              className="section-heading max-w-2xl text-2xl leading-[1.15] text-heading sm:text-3xl lg:text-4xl"
            >
              {activeStory.title}
            </h3>

            <p
              data-tj-excerpt
              className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {activeStory.excerpt}
            </p>

            <Link
              data-tj-link
              href={`/journal/${activeStory.slug}`}
              className="inline-flex items-center gap-1.5 border-b border-primary/30 pb-0.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5 sm:text-base"
            >
              {TRAVEL_JOURNAL_COPY.readStory}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { JournalStoryCarousel };
