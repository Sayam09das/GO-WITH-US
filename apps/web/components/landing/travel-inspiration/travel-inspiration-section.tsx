"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { InspirationStory } from "@/types/inspiration";
import { InspirationFeaturedStory } from "./inspiration-featured-story";
import { InspirationStoryCard } from "./inspiration-story-card";
import { TravelInspirationHeader } from "./travel-inspiration-header";

interface TravelInspirationSectionProps {
  featured?: InspirationStory;
  stories: InspirationStory[];
}

function TravelInspirationSection({ featured, stories }: TravelInspirationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const supportingStories = stories.filter((story) => !story.isFeatured);
  const [sideOne, sideTwo, ...bottomStories] = supportingStories;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (reducedMotion || !section || !grid) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-ti-featured], [data-ti-card]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-ti-image-mask]", {
        clipPath: "inset(5% 5% 5% 5% round 0.75rem)",
        autoAlpha: 0.9,
      });
      gsap.set("[data-ti-title], [data-ti-excerpt], [data-ti-read-label], [data-ti-link]", {
        autoAlpha: 0,
        y: 12,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-ti-featured]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
        })
        .to(
          "[data-ti-featured] [data-ti-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 0.75rem)",
            autoAlpha: 1,
            duration: 0.75,
          },
          "-=0.4",
        )
        .to(
          "[data-ti-featured] [data-ti-title], [data-ti-featured] [data-ti-excerpt], [data-ti-featured] [data-ti-read-label], [data-ti-featured] [data-ti-link]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
          },
          "-=0.45",
        )
        .to(
          "[data-ti-card]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.35",
        )
        .to(
          "[data-ti-card] [data-ti-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 0.75rem)",
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.08,
          },
          "-=0.5",
        )
        .to(
          "[data-ti-card] [data-ti-title], [data-ti-card] [data-ti-excerpt], [data-ti-card] [data-ti-read-label], [data-ti-card] [data-ti-link]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
          },
          "-=0.42",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (!featured) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="travel-inspiration-heading"
      className={cn(
        "travel-section bg-section-warm",
        reducedMotion &&
          "[&_[data-ti-card]]:opacity-100 [&_[data-ti-excerpt]]:opacity-100 [&_[data-ti-featured]]:opacity-100 [&_[data-ti-image-mask]]:opacity-100 [&_[data-ti-link]]:opacity-100 [&_[data-ti-read-label]]:opacity-100 [&_[data-ti-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          <TravelInspirationHeader />

          <div ref={gridRef} className="flex flex-col gap-5 lg:gap-6 xl:gap-8">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start lg:gap-6 xl:gap-8">
              <div className="lg:col-span-7 xl:col-span-8">
                <InspirationFeaturedStory story={featured} />
              </div>

              <div className="grid grid-cols-1 items-stretch gap-5 lg:col-span-5 lg:grid-rows-2 lg:gap-6 xl:col-span-4">
                {sideOne ? (
                  <InspirationStoryCard story={sideOne} variant="compact" index={0} />
                ) : null}
                {sideTwo ? (
                  <InspirationStoryCard story={sideTwo} variant="compact" index={1} />
                ) : null}
              </div>
            </div>

            {bottomStories.length > 0 ? (
              <div className="grid grid-cols-1 items-stretch gap-5 min-[520px]:grid-cols-2 lg:gap-6">
                {bottomStories.map((story, index) => (
                  <InspirationStoryCard
                    key={story.id}
                    story={story}
                    variant="standard"
                    index={index + 2}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export { TravelInspirationSection };
