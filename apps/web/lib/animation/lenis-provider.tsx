"use client";

import Lenis from "lenis";
import { useEffect } from "react";

interface LenisProviderProps {
  children: React.ReactNode;
}

/** Global smooth scroll — enable when editorial pages need Lenis. */
export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}
