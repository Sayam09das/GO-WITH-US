"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardRecentAnimation(
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
      gsap.set("[data-dash-recent-reveal]", { autoAlpha: 0, y: 14 });
      gsap.set("[data-dash-recent-card]", { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-dash-recent-reveal]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.05,
        })
        .to(
          "[data-dash-recent-card]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.07,
          },
          "-=0.26",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
