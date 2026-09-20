"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { bindLayerParallax } from "@/lib/animation/scroll-parallax";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ABOUT_IMAGES } from "@/lib/landing/about";
import { cn } from "@/lib/utils";
import { AboutImage } from "./about-image";

const parallaxLayer = "absolute inset-[-10%] will-change-transform";

function AboutCollage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-about-image]", { autoAlpha: 0, scale: 1.05, y: 28 });

      gsap.to("[data-about-image]", {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
        },
      });

      bindLayerParallax({
        root,
        layerSelector: "[data-about-parallax]",
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto h-[400px] w-full max-w-md sm:h-[480px] sm:max-w-lg md:h-[520px] lg:mx-0 lg:max-w-none"
    >
      {/* Venice — primary portrait (back layer) */}
      <div
        data-about-image
        data-about-slot="venice"
        className={cn(
          "absolute left-0 top-0 z-0 h-[92%] w-[76%] overflow-hidden rounded-[1.75rem] shadow-md will-change-transform sm:rounded-[2rem]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-about-parallax data-parallax-speed="slow" className={parallaxLayer}>
          <AboutImage
            config={ABOUT_IMAGES.venice}
            sizes="(max-width: 640px) 76vw, (max-width: 1024px) 40vw, 35vw"
          />
        </div>
      </div>

      {/* Beach — top-right overlap */}
      <div
        data-about-image
        data-about-slot="beach"
        className={cn(
          "absolute right-0 top-[5%] z-10 aspect-square w-[46%] overflow-hidden rounded-[1.5rem] border-4 border-background shadow-lg will-change-transform sm:rounded-[1.75rem]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-about-parallax data-parallax-speed="fast" className={parallaxLayer}>
          <AboutImage
            config={ABOUT_IMAGES.beach}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 22vw, 20vw"
          />
        </div>
      </div>

      {/* Cappadocia — bottom overlap */}
      <div
        data-about-image
        data-about-slot="cappadocia"
        className={cn(
          "absolute bottom-0 left-[14%] z-10 aspect-[5/4] w-[58%] overflow-hidden rounded-[1.5rem] border-4 border-background shadow-lg will-change-transform sm:rounded-[1.75rem]",
          reducedMotion && "opacity-100",
        )}
      >
        <div data-about-parallax data-parallax-speed="medium" className={parallaxLayer}>
          <AboutImage
            config={ABOUT_IMAGES.cappadocia}
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 28vw, 25vw"
          />
        </div>
      </div>
    </div>
  );
}

export { AboutCollage };
