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
