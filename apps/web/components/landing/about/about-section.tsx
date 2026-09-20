"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { bindParallax, bindSectionScrollOut } from "@/lib/animation/scroll-parallax";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { AboutCollage } from "./about-collage";
import { AboutContent } from "./about-content";

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const collage = collageRef.current;

    if (reducedMotion || !section || !content || !collage) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      bindSectionScrollOut(content, section);
      bindParallax(collage, {
        trigger: section,
        speed: "slow",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-section-heading"
      className="travel-section bg-background"
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
          <div ref={collageRef} className="order-2 w-full min-w-0 will-change-transform lg:order-1">
            <AboutCollage />
          </div>
          <div ref={contentRef} className="order-1 w-full min-w-0 lg:order-2">
            <AboutContent />
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutSection };
