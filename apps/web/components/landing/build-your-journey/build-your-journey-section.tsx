"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { BUILD_YOUR_JOURNEY_COPY, JOURNEY_STEPS } from "@/lib/landing/build-your-journey";
import { cn } from "@/lib/utils";
import { BuildYourJourneyHeader } from "./build-your-journey-header";
import { JourneyStepCard } from "./journey-step-card";

function BuildYourJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const steps = stepsRef.current;
    if (reducedMotion || !section || !panel || !steps) {
      return;
    }

    registerGsapPlugins();
    gsap.registerPlugin(DrawSVGPlugin);

    const ctx = gsap.context(() => {
      gsap.set("[data-byj-panel]", { autoAlpha: 0, y: 36, scale: 0.985 });
      gsap.set("[data-byj-step]", { autoAlpha: 0, y: 28, scale: 0.98 });
      gsap.set("[data-byj-step-icon]", { autoAlpha: 0, scale: 0.9 });
      gsap.set("[data-byj-step-title], [data-byj-step-desc], [data-byj-step-number]", {
        autoAlpha: 0,
        y: 10,
      });
      gsap.set("[data-byj-path]", { drawSVG: "0%" });
      gsap.set("[data-byj-cta]", { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-byj-panel]", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
        })
        .to(
          "[data-byj-path]",
          {
            drawSVG: "100%",
            duration: 1.1,
            ease: "power1.inOut",
          },
          "-=0.35",
        )
        .to(
          "[data-byj-step]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
          },
          "-=0.85",
        )
        .to(
          "[data-byj-step-icon]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.55",
        )
        .to(
          "[data-byj-step-title], [data-byj-step-desc], [data-byj-step-number]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
          },
          "-=0.42",
        )
        .to(
          "[data-byj-cta]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="build-your-journey-heading"
      className={cn(
        "travel-section bg-background",
        reducedMotion &&
          "[&_[data-byj-cta]]:opacity-100 [&_[data-byj-panel]]:opacity-100 [&_[data-byj-path]]:opacity-100 [&_[data-byj-step]]:opacity-100 [&_[data-byj-step-desc]]:opacity-100 [&_[data-byj-step-icon]]:opacity-100 [&_[data-byj-step-number]]:opacity-100 [&_[data-byj-step-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div
          ref={panelRef}
          data-byj-panel
          className="relative overflow-hidden rounded-[1.75rem] bg-section px-5 py-10 will-change-transform sm:rounded-[2rem] sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-14 xl:py-16"
        >
          <BuildYourJourneyHeader />

          <div ref={stepsRef} className="relative mt-10 lg:mt-12">
            <div
              className="pointer-events-none absolute inset-x-[8%] top-[4.75rem] hidden lg:block xl:inset-x-[6%]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 1000 12"
                preserveAspectRatio="none"
                className="h-3 w-full text-primary/35"
                aria-hidden="true"
              >
                <title>Planning flow connector</title>
                <path
                  data-byj-path
                  d="M0,6 H1000"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="8 10"
                />
              </svg>
            </div>

            <div
              className="pointer-events-none absolute bottom-[18%] left-[2.35rem] top-[4.5rem] lg:hidden"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 12 1000"
                preserveAspectRatio="none"
                className="h-full w-3 text-primary/30"
                aria-hidden="true"
              >
                <title>Planning flow connector</title>
                <path
                  data-byj-path
                  d="M6,0 V1000"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="8 10"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:gap-4 xl:gap-5">
              {JOURNEY_STEPS.map((step, index) => (
                <JourneyStepCard key={step.id} step={step} index={index} />
              ))}
            </div>
          </div>

          <div data-byj-cta className="mt-10 flex justify-center lg:mt-12">
            <Button asChild size="lg" className="w-full min-[480px]:w-auto">
              <Link href={BUILD_YOUR_JOURNEY_COPY.ctaHref}>
                {BUILD_YOUR_JOURNEY_COPY.cta}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { BuildYourJourneySection };
