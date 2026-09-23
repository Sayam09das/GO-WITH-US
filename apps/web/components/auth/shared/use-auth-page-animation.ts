"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function useAuthPageAnimation(
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
      gsap.set("[data-auth-reveal]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-auth-visual]", { autoAlpha: 0, scale: 0.97 });
      gsap.set("[data-auth-visual-inner]", { scale: 1.06 });
      gsap.set("[data-auth-visual-copy]", { autoAlpha: 0, y: 16 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.08,
      });

      timeline
        .to("[data-auth-reveal]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.07,
        })
        .to(
          "[data-auth-visual]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
          },
          "-=0.35",
        )
        .to(
          "[data-auth-visual-inner]",
          {
            scale: 1,
            duration: 1.1,
          },
          "-=0.85",
        )
        .to(
          "[data-auth-visual-copy]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.55",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}
