"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { bindLayerParallax } from "@/lib/animation/scroll-parallax";
import { getFeaturedStay, getSupportingStays } from "@/lib/api/stays";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { FeaturedStay } from "./featured-stay";
import { PlacesToStayHeader } from "./places-to-stay-header";
import { SupportingStayCard } from "./supporting-stay-card";

function PlacesToStaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const featured = getFeaturedStay();
  const supportingStays = getSupportingStays();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const supporting = supportingRef.current;
    if (reducedMotion || !section) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-pts-featured], [data-pts-supporting]", { autoAlpha: 0, y: 32 });
      gsap.set("[data-pts-image-mask]", {
        clipPath: "inset(6% 6% 6% 6% round 1.25rem)",
        autoAlpha: 0.92,
      });
      gsap.set("[data-pts-title], [data-pts-description], [data-pts-location], [data-pts-link]", {
        autoAlpha: 0,
        y: 14,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-pts-featured]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        })
        .to(
          "[data-pts-featured] [data-pts-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
            autoAlpha: 1,
            duration: 0.8,
          },
          "-=0.45",
        )
        .to(
          "[data-pts-featured] [data-pts-title], [data-pts-featured] [data-pts-description], [data-pts-featured] [data-pts-location], [data-pts-featured] [data-pts-link]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
          },
          "-=0.5",
        )
        .to(
          "[data-pts-supporting]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
          },
          "-=0.35",
        )
        .to(
          "[data-pts-supporting] [data-pts-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .to(
          "[data-pts-supporting] [data-pts-title], [data-pts-supporting] [data-pts-location], [data-pts-supporting] [data-pts-link]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
          },
          "-=0.45",
        );

      if (supporting) {
        bindLayerParallax({
          root: supporting,
          layerSelector: "[data-pts-parallax]",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (!featured) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="places-to-stay-heading"
      className={cn(
        "travel-section bg-background",
        reducedMotion &&
          "[&_[data-pts-description]]:opacity-100 [&_[data-pts-featured]]:opacity-100 [&_[data-pts-image-mask]]:opacity-100 [&_[data-pts-link]]:opacity-100 [&_[data-pts-location]]:opacity-100 [&_[data-pts-supporting]]:opacity-100 [&_[data-pts-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          <PlacesToStayHeader />

          <FeaturedStay stay={featured} />

          <div
            ref={supportingRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-6 xl:gap-8"
          >
            {supportingStays.map((stay, index) => (
              <SupportingStayCard key={stay.id} stay={stay} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { PlacesToStaySection };
