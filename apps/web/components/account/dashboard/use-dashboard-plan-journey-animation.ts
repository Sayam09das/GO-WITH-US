"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardPlanJourneyAnimation(
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
      gsap.set("[data-dash-plan-panel]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-dash-plan-reveal]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-dash-plan-visual]", { autoAlpha: 0, scale: 0.98 });
      gsap.set("[data-dash-plan-image-inner]", { scale: 1.1, x: 18 });

      const enterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      enterTimeline
        .to("[data-dash-plan-panel]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
        })
        .to(
          "[data-dash-plan-reveal]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.06,
          },
          "-=0.48",
        )
        .to(
          "[data-dash-plan-visual]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.82,
          },
          "-=0.58",
        )
        .to(
          "[data-dash-plan-image-inner]",
          {
            scale: 1,
            x: 0,
            duration: 1.05,
            ease: "power1.out",
          },
          "-=0.82",
        );

      gsap.to("[data-dash-plan-image-inner]", {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
