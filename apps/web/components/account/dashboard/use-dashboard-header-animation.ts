"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useDashboardHeaderAnimation(
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
      gsap.set("[data-dash-reveal]", { autoAlpha: 0, y: 18 });

      gsap.to("[data-dash-reveal]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.06,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
