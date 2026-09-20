"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { WHAT_WE_GIVE_FEATURES } from "@/lib/landing/what-we-give";
import { cn } from "@/lib/utils";
import { WhatWeGiveContent } from "./what-we-give-content";
import { WhatWeGiveFeatureCard } from "./what-we-give-feature-card";

function WhatWeGiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (reducedMotion || !section || !cards) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-wwg-card]", { autoAlpha: 0, y: 36, scale: 0.98 });
      gsap.set("[data-wwg-card-icon]", { autoAlpha: 0, y: 16, scale: 0.92 });
      gsap.set("[data-wwg-card-title]", { autoAlpha: 0, y: 14 });
      gsap.set("[data-wwg-card-desc]", { autoAlpha: 0, y: 12 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-wwg-card]", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.14,
        })
        .to(
          "[data-wwg-card-icon]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .to(
          "[data-wwg-card-title]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.42",
        )
        .to(
          "[data-wwg-card-desc]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.38",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="what-we-give-heading"
      className={cn(
        "travel-section bg-section-warm",
        reducedMotion &&
          "[&_[data-wwg-card]]:opacity-100 [&_[data-wwg-card-desc]]:opacity-100 [&_[data-wwg-card-icon]]:opacity-100 [&_[data-wwg-card-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:items-center lg:gap-10 xl:gap-16">
          <WhatWeGiveContent />

          <div
            ref={cardsRef}
            className="grid grid-cols-1 gap-6 min-[640px]:grid-cols-3 min-[640px]:items-end min-[640px]:gap-5 lg:gap-6 xl:gap-8"
          >
            {WHAT_WE_GIVE_FEATURES.map((feature, index) => (
              <WhatWeGiveFeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { WhatWeGiveSection };
