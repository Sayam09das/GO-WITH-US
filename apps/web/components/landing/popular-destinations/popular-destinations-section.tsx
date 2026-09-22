"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { getPopularDestinations } from "@/lib/api/destinations";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { POPULAR_DESTINATIONS_COPY } from "@/lib/landing/popular-destinations";
import { cn } from "@/lib/utils";
import { DestinationCard } from "./destination-card";

function PopularDestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const destinations = getPopularDestinations(6);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (reducedMotion || !section || !grid) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-pd-card]", { autoAlpha: 0, y: 36, scale: 0.97 });
      gsap.set("[data-pd-image-mask]", {
        clipPath: "inset(8% 8% 8% 8% round 0.75rem)",
        autoAlpha: 0.9,
      });
      gsap.set("[data-pd-title]", { autoAlpha: 0, y: 14 });
      gsap.set("[data-pd-location]", { autoAlpha: 0, y: 12 });
      gsap.set("[data-pd-price]", { autoAlpha: 0, scale: 0.94 });
      gsap.set("[data-pd-rating]", { autoAlpha: 0, scale: 0.9 });
      gsap.set("[data-pd-cta]", { autoAlpha: 0, y: 20 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-pd-card]", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
        })
        .to(
          "[data-pd-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 0.75rem)",
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.55",
        )
        .to(
          "[data-pd-rating]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.5",
        )
        .to(
          "[data-pd-title]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.42",
        )
        .to(
          "[data-pd-location]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.38",
        )
        .to(
          "[data-pd-price]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .to(
          "[data-pd-cta]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Popular destinations"
      className={cn(
        "travel-section bg-background",
        reducedMotion &&
          "[&_[data-pd-card]]:opacity-100 [&_[data-pd-cta]]:opacity-100 [&_[data-pd-image-mask]]:opacity-100 [&_[data-pd-location]]:opacity-100 [&_[data-pd-price]]:opacity-100 [&_[data-pd-rating]]:opacity-100 [&_[data-pd-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {destinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>

        <div data-pd-cta className="mt-10 flex justify-center sm:mt-12">
          <Button asChild size="lg" className="min-w-[10.5rem]">
            <Link href="/destinations">{POPULAR_DESTINATIONS_COPY.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { PopularDestinationsSection };
