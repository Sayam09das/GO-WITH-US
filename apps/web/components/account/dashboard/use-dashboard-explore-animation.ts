"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardExploreAnimation(
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
      gsap.set("[data-dash-explore-reveal]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-dash-explore-panel]", { autoAlpha: 0, y: 24, scale: 0.98 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-dash-explore-reveal]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.06,
        })
        .to(
          "[data-dash-explore-panel]",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            stagger: 0.1,
          },
          "-=0.28",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
