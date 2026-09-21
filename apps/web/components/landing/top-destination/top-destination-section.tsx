"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TopDestinationContent } from "./top-destination-content";
import { TopDestinationSearchBar } from "./top-destination-search-bar";

function TopDestinationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (reducedMotion || !section || !panel) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-td-panel]", { autoAlpha: 0, y: 40, scale: 0.98 });
      gsap.set("[data-td-search]", { autoAlpha: 0, y: 48 });
      gsap.set("[data-td-field]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-td-cta]", { autoAlpha: 0, scale: 0.96 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-td-panel]", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
        })
        .to(
          "[data-td-search]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
          },
          "-=0.35",
        )
        .to(
          "[data-td-field]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.45",
        )
        .to(
          "[data-td-cta]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
          },
          "-=0.25",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="top-destination-heading"
      className={cn(
        "travel-section bg-background pb-8 sm:pb-10",
        reducedMotion &&
          "[&_[data-td-cta]]:opacity-100 [&_[data-td-field]]:opacity-100 [&_[data-td-panel]]:opacity-100 [&_[data-td-search]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div
          ref={panelRef}
          data-td-panel
          className="relative overflow-visible rounded-[1.75rem] bg-soft-gray px-5 pb-24 pt-12 will-change-transform sm:rounded-[2rem] sm:px-8 sm:pb-28 sm:pt-16 lg:px-12 lg:pb-32 lg:pt-20"
        >
          <TopDestinationContent />

          <div className="absolute inset-x-0 -bottom-14 flex justify-center px-4 sm:-bottom-16 sm:px-6 lg:-bottom-[4.5rem] lg:px-10">
            <TopDestinationSearchBar />
          </div>
        </div>

        <div aria-hidden="true" className="h-10 sm:h-12 lg:h-14" />
      </div>
    </section>
  );
}

export { TopDestinationSection };
