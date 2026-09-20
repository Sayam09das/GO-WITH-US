"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/animation/gsap";

interface LenisProviderProps {
  children: React.ReactNode;
}

/** Global smooth scroll — premium Lenis feel synced with GSAP ScrollTrigger. */
export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    registerGsapPlugins();

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const tick = (time: number) => {
      lenis.raf(time);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      lenis.destroy();
    };
  }, []);

  return children;
}
