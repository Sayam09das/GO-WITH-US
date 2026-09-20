"use client";

import { BadgeCheck } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { bindLayerParallax } from "@/lib/animation/scroll-parallax";
import { HERO_COPY, HERO_IMAGES } from "@/lib/hero";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { HeroImage } from "./hero-image";

const imageShell =
  "absolute overflow-hidden rounded-[1.5rem] border-4 border-background shadow-lg will-change-transform sm:rounded-[1.75rem]";

const parallaxLayer = "absolute inset-[-10%] will-change-transform";

function HeroCollage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (reducedMotion || !root) {
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

      bindLayerParallax({
        root,
        layerSelector: "[data-hero-parallax]",
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto h-[400px] w-full max-w-[22rem] min-[400px]:max-w-md sm:h-[460px] sm:max-w-lg md:h-[500px] lg:mx-0 lg:h-[520px] lg:max-w-none"
    >
      {/* Balloon — top-left */}
      <div
        data-hero-image
        className={cn(
          imageShell,
          "left-0 top-0 z-10 h-[54%] w-[56%]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-hero-parallax data-parallax-speed="slow" className={parallaxLayer}>
          <HeroImage
            config={HERO_IMAGES.balloon}
            priority
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 35vw, 30vw"
          />
        </div>

        <div
          data-hero-card
          data-hero-float
          className="absolute bottom-2 left-2 right-2 z-10 rounded-xl border border-white/50 bg-white/85 px-3 py-2.5 shadow-md backdrop-blur-md sm:bottom-3 sm:left-3 sm:right-auto sm:max-w-[200px] sm:rounded-2xl sm:px-4 sm:py-3"
        >
          <p className="text-xs font-bold text-heading sm:text-sm">{HERO_COPY.statDestinations}</p>
          <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-xs">
            {HERO_COPY.statDestinationsSub}
          </p>
        </div>
      </div>

      {/* Pier — tall right */}
      <div
        data-hero-image
        className={cn(
          imageShell,
          "right-0 top-0 z-20 h-[72%] w-[42%]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-hero-parallax data-parallax-speed="fast" className={parallaxLayer}>
          <HeroImage
            config={HERO_IMAGES.pier}
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 25vw, 22vw"
          />
        </div>

        <div
          data-hero-card
          className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 text-[10px] font-semibold text-heading shadow-md backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]"
        >
          <BadgeCheck aria-hidden="true" className="size-3 text-primary sm:size-3.5" />
          {HERO_COPY.statVerified}
        </div>
      </div>

      {/* Resort — bottom-left wide */}
      <div
        data-hero-image
        className={cn(
          imageShell,
          "bottom-0 left-0 z-10 h-[42%] w-[58%]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-hero-parallax data-parallax-speed="medium" className={parallaxLayer}>
          <HeroImage
            config={HERO_IMAGES.beach}
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 35vw, 30vw"
          />
        </div>
      </div>

      {/* Hiker — bottom-right */}
      <div
        data-hero-image
        className={cn(
          imageShell,
          "bottom-0 right-0 z-20 h-[38%] w-[40%]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-hero-parallax data-parallax-speed="slow" className={parallaxLayer}>
          <HeroImage
            config={HERO_IMAGES.hiker}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 24vw, 20vw"
          />
        </div>
      </div>
    </div>
  );
}

export { HeroCollage };
