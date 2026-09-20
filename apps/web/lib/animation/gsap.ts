"use client";

import gsap from "gsap";

let registered = false;

/** Register GSAP plugins once on the client. Call before scroll/hero timelines. */
export function registerGsapPlugins(): typeof gsap {
  if (typeof window === "undefined" || registered) {
    return gsap;
  }

  registered = true;
  return gsap;
}

export { gsap };
