"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { STAY_INSPIRED_COPY } from "@/lib/landing/stay-inspired";
import { cn } from "@/lib/utils";
import { StayInspiredForm } from "./stay-inspired-form";
import { StayInspiredVisual } from "./stay-inspired-visual";

function StayInspiredSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;

    if (reducedMotion || !section || !visual) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-si-copy]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-si-form]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-si-visual]", { autoAlpha: 0, y: 28, scale: 0.98 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-si-copy]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
        })
        .to(
          "[data-si-form]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.35",
        )
        .to(
          "[data-si-visual]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
          },
          "-=0.45",
        );

      gsap.to("[data-si-visual-image]", {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stay-inspired-heading"
      className={cn(
        "travel-section border-t border-border/60 bg-section-warm",
        reducedMotion &&
          "[&_[data-si-copy]]:opacity-100 [&_[data-si-form]]:opacity-100 [&_[data-si-visual]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-20">
          <div className="flex flex-col gap-6 sm:gap-7">
            <div className="flex flex-col gap-3 sm:gap-4">
              <p data-si-copy className="label-text text-primary will-change-transform">
                {STAY_INSPIRED_COPY.eyebrow}
              </p>

              <h2
                id="stay-inspired-heading"
                data-si-copy
                className="section-heading max-w-xl text-[2rem] leading-[1.1] text-heading will-change-transform sm:text-4xl lg:text-[2.75rem]"
              >
                {STAY_INSPIRED_COPY.headline}{" "}
                <span aria-hidden="true" className="inline-block not-italic">
                  {STAY_INSPIRED_COPY.emoji}
                </span>
              </h2>

              <p
                data-si-copy
                className="max-w-lg text-[0.9375rem] leading-relaxed text-muted-foreground will-change-transform sm:text-base"
              >
                {STAY_INSPIRED_COPY.supporting}
              </p>
            </div>

            <StayInspiredForm />
          </div>

          <div ref={visualRef} className="flex justify-center lg:justify-end">
            <StayInspiredVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

export { StayInspiredSection };
