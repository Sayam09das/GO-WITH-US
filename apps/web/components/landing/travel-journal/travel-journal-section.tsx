"use client";

import { useLayoutEffect, useRef } from "react";
import { EmptyState } from "@/components/states";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_JOURNAL_COPY } from "@/lib/landing/travel-journal";
import { cn } from "@/lib/utils";
import type { JournalStory } from "@/types/journal";
import { JournalStoryCarousel } from "./journal-story-carousel";
import { TravelJournalHeader } from "./travel-journal-header";

interface TravelJournalSectionProps {
  stories: JournalStory[];
}

function TravelJournalSection({ stories }: TravelJournalSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (stories.length === 0) {
      return;
    }

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

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, stories.length]);

  if (stories.length === 0) {
    return (
      <section
        aria-labelledby="travel-journal-heading"
        className="travel-section overflow-x-clip bg-section-warm"
      >
        <div className="container-travel flex flex-col gap-10 sm:gap-12">
          <TravelJournalHeader />
          <EmptyState
            title="Journal stories will appear here"
            description="Start the API and seed stories to enable the diagonal story carousel."
            action={{ label: TRAVEL_JOURNAL_COPY.readStory, href: "/journal" }}
          />
        </div>
      </section>
    );
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
