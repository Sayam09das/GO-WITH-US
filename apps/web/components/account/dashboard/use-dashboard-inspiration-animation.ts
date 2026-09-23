"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardInspirationAnimation(
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
      gsap.set("[data-dash-inspiration-reveal]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-dash-inspiration-featured]", { autoAlpha: 0, y: 24, scale: 0.98 });
      gsap.set("[data-dash-inspiration-card]", { autoAlpha: 0, y: 20 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-dash-inspiration-reveal]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.06,
        })
        .to(
          "[data-dash-inspiration-featured]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.68,
          },
          "-=0.28",
        )
        .to(
          "[data-dash-inspiration-card]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.1,
          },
          "-=0.42",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
