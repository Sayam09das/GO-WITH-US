"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { getJournalStories } from "@/lib/api/journal";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { JournalStoryCarousel } from "./journal-story-carousel";
import { TravelJournalHeader } from "./travel-journal-header";

function TravelJournalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const stories = getJournalStories();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-tj-carousel]", { autoAlpha: 0, y: 40 });
      gsap.set("[data-tj-active-story]", { autoAlpha: 0, y: 24 });
      gsap.set(
        "[data-tj-title], [data-tj-excerpt], [data-tj-location], [data-tj-link], [data-tj-read-label], [data-tj-category], [data-tj-issue]",
        {
          autoAlpha: 0,
          y: 14,
        },
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-tj-issue]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
        })
        .to(
          "[data-tj-carousel]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
          },
          "-=0.15",
        )
        .to(
          "[data-tj-active-story]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.45",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (stories.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="travel-journal-heading"
      className={cn(
        "travel-section overflow-x-clip bg-section-warm",
        reducedMotion &&
          "[&_[data-tj-active-story]]:opacity-100 [&_[data-tj-carousel]]:opacity-100 [&_[data-tj-category]]:opacity-100 [&_[data-tj-excerpt]]:opacity-100 [&_[data-tj-issue]]:opacity-100 [&_[data-tj-link]]:opacity-100 [&_[data-tj-location]]:opacity-100 [&_[data-tj-read-label]]:opacity-100 [&_[data-tj-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          <TravelJournalHeader />
        </div>
      </div>

      <JournalStoryCarousel stories={stories} />
    </section>
  );
}

export { TravelJournalSection };
