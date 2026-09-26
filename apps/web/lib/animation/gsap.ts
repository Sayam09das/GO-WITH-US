"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins once on the client. Call before scroll/hero timelines. */
export function registerGsapPlugins(): typeof gsap {
  if (typeof window === "undefined") {
    return gsap;
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return gsap;
}

export { gsap, ScrollTrigger };

/** If the trigger is already past its start, finish the timeline so content is not left at autoAlpha 0. */
export function revealScrollTimelineIfAlreadyVisible(
  section: HTMLElement,
  timeline: gsap.core.Timeline,
  startRatio = 0.85,
): void {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    const scrollTrigger = timeline.scrollTrigger;
    if (!scrollTrigger || scrollTrigger.progress > 0) {
      return;
    }

    const threshold = window.innerHeight * startRatio;
    if (section.getBoundingClientRect().top < threshold) {
      timeline.progress(1);
    }
  });
}
