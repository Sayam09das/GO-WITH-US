"use client";

import { useLayoutEffect, useRef } from "react";
import { DestinationsHeroContent } from "@/components/destinations/destinations-hero-content";
import { DestinationsHeroImage } from "@/components/destinations/destinations-hero-image";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { bindParallax } from "@/lib/animation/scroll-parallax";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function DestinationsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) {
      return;
    }

    const imageInner = section.querySelector("[data-dest-image-inner]");

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-dest-heading]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-dest-image-mask]", {
        clipPath: "inset(6% 6% 6% 6% round 1.25rem)",
        autoAlpha: 0.92,
      });
      gsap.set("[data-dest-image-inner]", { scale: 1.05 });
      gsap.set("[data-dest-location]", { autoAlpha: 0, y: 14 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.12,
      });

      timeline
        .to("[data-dest-heading]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
        })
        .to(
          "[data-dest-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
            autoAlpha: 1,
            duration: 0.9,
          },
          "-=0.28",
        )
        .to(
          "[data-dest-image-inner]",
          {
            scale: 1,
            duration: 1,
          },
          "-=0.9",
        )
        .to(
          "[data-dest-location]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.45",
        );

      if (imageInner) {
        bindParallax(imageInner, {
          trigger: section,
          speed: "slow",
          scrub: 1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="destinations-hero-heading"
      className={cn(
        "bg-background pb-12 pt-[5.5rem] sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32",
        reducedMotion &&
          "[&_[data-dest-heading]]:opacity-100 [&_[data-dest-image-mask]]:opacity-100 [&_[data-dest-location]]:opacity-100",
      )}
    >
      <div className="container-travel flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <DestinationsHeroContent />

        <DestinationsHeroImage />
      </div>
    </section>
  );
}

export { DestinationsHero };
