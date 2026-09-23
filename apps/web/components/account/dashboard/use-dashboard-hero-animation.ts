"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardHeroAnimation(
  rootRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
): void {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (reducedMotion || !root) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-dash-hero-copy]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-dash-hero-visual]", {
        autoAlpha: 0,
        scale: 0.97,
      });
      gsap.set("[data-dash-hero-image-inner]", { scale: 1.06 });
      gsap.set("[data-dash-hero-label]", { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.1,
      });

      timeline
        .to("[data-dash-hero-copy]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.07,
        })
        .to(
          "[data-dash-hero-visual]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
          },
          "-=0.32",
        )
        .to(
          "[data-dash-hero-image-inner]",
          {
            scale: 1,
            duration: 1,
          },
          "-=0.85",
        )
        .to(
          "[data-dash-hero-label]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.5",
        )
        .to(
          "[data-dash-hero-label]",
          {
            y: -5,
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          "-=0.1",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
