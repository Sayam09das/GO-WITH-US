"use client";

import { BadgeCheck } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { HERO_COPY, HERO_IMAGES } from "@/lib/hero";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { HeroImage } from "./hero-image";

const imageShellClass =
  "relative min-h-[140px] overflow-hidden rounded-[1.75rem] will-change-transform";

function HeroCollage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-image]", { autoAlpha: 0, scale: 1.04 });
      gsap.set("[data-hero-card]", { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to("[data-hero-image]", {
        autoAlpha: 1,
        scale: 1,
        duration: 0.75,
        stagger: 0.1,
      }).to(
        "[data-hero-card]",
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        "-=0.35",
      );

      gsap.to("[data-hero-float]", {
        y: -10,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.35,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-6 lg:h-[520px]">
        {/* Hot air balloon */}
        <div
          data-hero-image
          className={cn(
            imageShellClass,
            "col-span-1 aspect-[5/6] lg:col-span-7 lg:row-span-3 lg:aspect-auto lg:min-h-0",
            reducedMotion && "opacity-100",
          )}
        >
          <HeroImage config={HERO_IMAGES.balloon} priority sizes="(max-width: 1024px) 50vw, 35vw" />

          <div
            data-hero-card
            data-hero-float
            className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-[220px]"
          >
            <p className="text-sm font-bold text-heading">{HERO_COPY.statDestinations}</p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
              {HERO_COPY.statDestinationsSub}
            </p>
          </div>
        </div>

        {/* Tropical pier */}
        <div
          data-hero-image
          className={cn(
            imageShellClass,
            "col-span-1 row-span-2 aspect-[3/5] lg:col-span-5 lg:row-span-4 lg:aspect-auto lg:min-h-0",
            reducedMotion && "opacity-100",
          )}
        >
          <HeroImage config={HERO_IMAGES.pier} sizes="(max-width: 1024px) 45vw, 25vw" />

          <div
            data-hero-card
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-heading shadow-md backdrop-blur-sm"
          >
            <BadgeCheck aria-hidden="true" className="size-3.5 text-primary" />
            {HERO_COPY.statVerified}
          </div>
        </div>

        {/* Beach walkway */}
        <div
          data-hero-image
          className={cn(
            imageShellClass,
            "col-span-1 aspect-[5/4] lg:col-span-7 lg:row-span-3 lg:aspect-auto lg:min-h-0",
            reducedMotion && "opacity-100",
          )}
        >
          <HeroImage config={HERO_IMAGES.beach} sizes="(max-width: 1024px) 50vw, 35vw" />
        </div>

        {/* Mountain hiker */}
        <div
          data-hero-image
          className={cn(
            imageShellClass,
            "col-span-1 aspect-[4/5] lg:col-span-5 lg:row-span-2 lg:aspect-auto lg:min-h-0",
            reducedMotion && "opacity-100",
          )}
        >
          <HeroImage config={HERO_IMAGES.hiker} sizes="(max-width: 1024px) 45vw, 25vw" />
        </div>
      </div>
    </div>
  );
}

export { HeroCollage };
