"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type Transition } from "motion/react";
import Image from "next/image";
import * as React from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface DiagonalCarouselItem {
  id: string;
  src: string;
  title: string;
  alt?: string;
}

interface CarouselSlide extends DiagonalCarouselItem {
  logicalIndex: number;
}

export interface DiagonalCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: DiagonalCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  loop?: boolean;
  slideSize?: number;
  rotationStep?: number;
  verticalStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  /** Slides farther than this from the active index fade out (reduces edge clutter). */
  maxVisibleDistance?: number;
  viewportClassName?: string;
  slideClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
  controlsClassName?: string;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const REDUCED_MOTION_TRANSITION: Transition = {
  duration: 0.2,
  ease: [0, 0, 0.2, 1],
};

const INSTANT_TRANSITION: Transition = { duration: 0 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function buildLoopSlides(items: DiagonalCarouselItem[]): CarouselSlide[] {
  return Array.from({ length: items.length * 3 }, (_, index) => {
    const logicalIndex = index % items.length;
    const item = items[logicalIndex] as DiagonalCarouselItem;

    return {
      ...item,
      id: `${item.id}-loop-${index}`,
      logicalIndex,
    };
  });
}

function toLogicalIndex(displayIndex: number, itemCount: number, loopEnabled: boolean) {
  if (!loopEnabled) {
    return displayIndex;
  }

  return ((displayIndex % itemCount) + itemCount) % itemCount;
}

function normalizeLoopDisplayIndex(displayIndex: number, itemCount: number) {
  if (displayIndex >= itemCount * 2) {
    return displayIndex - itemCount;
  }

  if (displayIndex < itemCount) {
    return displayIndex + itemCount;
  }

  return displayIndex;
}

function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = false,
  slideSize = 260,
  rotationStep = 30,
  verticalStep = 120,
  inactiveScale = 0.6,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  maxVisibleDistance = 2,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}: DiagonalCarouselProps) {
  const reducedMotion = useReducedMotion();
  const loopEnabled = loop && items.length > 1;
  const maxIndex = Math.max(0, items.length - 1);
  const slides = loopEnabled
    ? buildLoopSlides(items)
    : items.map((item, index) => ({ ...item, logicalIndex: index }));

  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex),
  );
  const logicalIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);

  const [displayIndex, setDisplayIndex] = React.useState(() =>
    loopEnabled ? items.length + logicalIndex : logicalIndex,
  );
  const displayIndexRef = React.useRef(displayIndex);
  const [instantSnap, setInstantSnap] = React.useState(false);
  const skipExternalSyncRef = React.useRef(false);
  const isNavigatingRef = React.useRef(false);

  displayIndexRef.current = displayIndex;

  const safeSlideSize = Math.max(120, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);
  const motionTransition = reducedMotion ? REDUCED_MOTION_TRANSITION : transition;
  const activeTransition = instantSnap ? INSTANT_TRANSITION : motionTransition;

  React.useEffect(() => {
    if (skipExternalSyncRef.current || isNavigatingRef.current) {
      return;
    }

    setDisplayIndex(loopEnabled ? items.length + logicalIndex : logicalIndex);
  }, [items.length, logicalIndex, loopEnabled]);

  const commitLogicalIndex = React.useCallback(
    (nextLogicalIndex: number) => {
      const resolvedIndex = clamp(nextLogicalIndex, 0, maxIndex);

      if (activeIndex === undefined) {
        setUncontrolledIndex(resolvedIndex);
      }

      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, maxIndex, onActiveIndexChange],
  );

  const finishNavigation = React.useCallback(
    (nextDisplayIndex: number) => {
      if (!isNavigatingRef.current) {
        return;
      }

      if (loopEnabled) {
        const normalizedIndex = normalizeLoopDisplayIndex(nextDisplayIndex, items.length);

        if (normalizedIndex !== nextDisplayIndex) {
          skipExternalSyncRef.current = true;
          setInstantSnap(true);
          setDisplayIndex(normalizedIndex);

          requestAnimationFrame(() => {
            setInstantSnap(false);
            skipExternalSyncRef.current = false;
            isNavigatingRef.current = false;
          });
          return;
        }
      }

      isNavigatingRef.current = false;
    },
    [items.length, loopEnabled],
  );

  const scheduleNavigationFinish = React.useCallback(
    (nextDisplayIndex: number) => {
      window.setTimeout(
        () => {
          finishNavigation(nextDisplayIndex);
        },
        reducedMotion ? 250 : 900,
      );
    },
    [finishNavigation, reducedMotion],
  );

  const selectSlide = React.useCallback(
    (nextLogicalIndex: number) => {
      if (!items.length) {
        return;
      }

      if (loopEnabled) {
        const resolvedIndex = clamp(nextLogicalIndex, 0, maxIndex);
        const targetDisplayIndex = items.length + resolvedIndex;

        if (targetDisplayIndex === displayIndexRef.current) {
          return;
        }

        isNavigatingRef.current = true;
        setDisplayIndex(targetDisplayIndex);
        commitLogicalIndex(resolvedIndex);
        scheduleNavigationFinish(targetDisplayIndex);
        return;
      }

      const resolvedIndex = clamp(nextLogicalIndex, 0, maxIndex);
      setDisplayIndex(resolvedIndex);
      commitLogicalIndex(resolvedIndex);
    },
    [commitLogicalIndex, items.length, loopEnabled, maxIndex, scheduleNavigationFinish],
  );

  const goToNext = React.useCallback(() => {
    if (!items.length) {
      return;
    }

    isNavigatingRef.current = true;
    const nextDisplayIndex = displayIndexRef.current + 1;
    setDisplayIndex(nextDisplayIndex);
    commitLogicalIndex(toLogicalIndex(nextDisplayIndex, items.length, loopEnabled));
    scheduleNavigationFinish(nextDisplayIndex);
  }, [commitLogicalIndex, items.length, loopEnabled, scheduleNavigationFinish]);

  const goToPrevious = React.useCallback(() => {
    if (!items.length) {
      return;
    }

    isNavigatingRef.current = true;
    const nextDisplayIndex = displayIndexRef.current - 1;
    setDisplayIndex(nextDisplayIndex);
    commitLogicalIndex(toLogicalIndex(nextDisplayIndex, items.length, loopEnabled));
    scheduleNavigationFinish(nextDisplayIndex);
  }, [commitLogicalIndex, items.length, loopEnabled, scheduleNavigationFinish]);

  const handleTrackAnimationComplete = React.useCallback(() => {
    if (!loopEnabled || instantSnap) {
      return;
    }

    finishNavigation(displayIndex);
  }, [displayIndex, finishNavigation, instantSnap, loopEnabled]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  if (!items.length) {
    return null;
  }

  const isPreviousDisabled = !loopEnabled && logicalIndex === 0;
  const isNextDisabled = !loopEnabled && logicalIndex === maxIndex;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Story carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
      {...props}
    >
      <div className={cn("absolute inset-0 overflow-hidden", viewportClassName)}>
        <motion.div
          className="absolute left-1/2 top-[28%] flex w-fit sm:top-[30%]"
          animate={{ x: -(displayIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={activeTransition}
          onAnimationComplete={handleTrackAnimationComplete}
        >
          {slides.map((item, index) => {
            const isActive = displayIndex === index;
            const distance = index - displayIndex;
            const isWithinView = Math.abs(distance) <= maxVisibleDistance;

            return (
              <motion.div
                key={item.id}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-2 will-change-transform",
                  !isWithinView && "pointer-events-none",
                  slideClassName,
                )}
                style={{ width: safeSlideSize }}
                animate={
                  reducedMotion
                    ? {
                        rotate: 0,
                        scale: isActive ? 1 : 0.85,
                        y: 0,
                        opacity: isWithinView ? 1 : 0,
                      }
                    : {
                        rotate: distance * rotationStep,
                        scale: isActive ? 1 : safeInactiveScale,
                        y: distance * verticalStep,
                        opacity: isWithinView ? 1 : 0,
                      }
                }
                transition={activeTransition}
              >
                <motion.p
                  className={cn(
                    "max-w-[14rem] truncate whitespace-nowrap text-sm font-semibold text-heading",
                    labelClassName,
                  )}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.7,
                  }}
                  transition={
                    instantSnap ? INSTANT_TRANSITION : { duration: reducedMotion ? 0.15 : 0.3 }
                  }
                >
                  {item.title}
                </motion.p>

                <button
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onClick={() => selectSlide(item.logicalIndex)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt ?? item.title}
                    fill
                    sizes={`${safeSlideSize}px`}
                    quality={85}
                    draggable={false}
                    className={cn(
                      "h-full w-full select-none object-cover shadow-lg",
                      imageClassName,
                    )}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls ? (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-border/80 bg-card/85 px-2 text-foreground shadow-sm backdrop-blur-sm",
            controlsClassName,
          )}
        >
          <button
            type="button"
            aria-label="Show previous slide"
            disabled={isPreviousDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-soft-orange disabled:cursor-not-allowed disabled:opacity-35"
            onClick={goToPrevious}
          >
            <ChevronLeft className="size-5" />
          </button>

          {showDots ? (
            <div className="flex items-center justify-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={logicalIndex === index ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full bg-primary transition-[width,opacity] duration-300",
                    logicalIndex === index ? "w-7 opacity-100" : "w-2 opacity-30",
                  )}
                  onClick={() => selectSlide(index)}
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            aria-label="Show next slide"
            disabled={isNextDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-soft-orange disabled:cursor-not-allowed disabled:opacity-35"
            onClick={goToNext}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

export { DiagonalCarousel };
