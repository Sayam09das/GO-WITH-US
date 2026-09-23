"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardUpcomingTripAnimation(
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
      gsap.set("[data-dash-upcoming-reveal]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-dash-upcoming-card]", { autoAlpha: 0, y: 22 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.08,
      });

      timeline
        .to("[data-dash-upcoming-reveal]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.06,
        })
        .to(
          "[data-dash-upcoming-card]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
          },
          "-=0.28",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
