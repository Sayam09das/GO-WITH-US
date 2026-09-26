"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
  revealScrollTimelineIfAlreadyVisible,
} from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE } from "@/lib/landing/featured-experiences";
import { cn } from "@/lib/utils";
import type { ExperienceListItem } from "@/types/experience";
import { ExperienceCard } from "./experience-card";
import { FeaturedExperiencesHeader } from "./featured-experiences-header";

interface FeaturedExperiencesSectionProps {
  experiences: ExperienceListItem[];
}

function FeaturedExperiencesSection({ experiences }: FeaturedExperiencesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const displayExperiences =
    experiences.length > 0 ? experiences : FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (reducedMotion || !section || !grid || displayExperiences.length === 0) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-fe-card]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-fe-image-mask]", {
        clipPath: "inset(4% 4% 4% 4% round 0.75rem)",
        autoAlpha: 0.92,
      });
      gsap.set("[data-fe-title], [data-fe-location], [data-fe-description]", {
        autoAlpha: 0,
        y: 12,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });

      timeline
        .to("[data-fe-card]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
        })
        .to(
          "[data-fe-image-mask]",
          {
            clipPath: "inset(0% 0% 0% 0% round 0.75rem)",
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.1,
          },
          "-=0.45",
        )
        .to(
          "[data-fe-title], [data-fe-location], [data-fe-description]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
          },
          "-=0.4",
        );

      revealScrollTimelineIfAlreadyVisible(section, timeline);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, displayExperiences]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-experiences-heading"
      className={cn(
        "travel-section bg-background",
        reducedMotion &&
          "[&_[data-fe-card]]:opacity-100 [&_[data-fe-description]]:opacity-100 [&_[data-fe-image-mask]]:opacity-100 [&_[data-fe-location]]:opacity-100 [&_[data-fe-title]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          <FeaturedExperiencesHeader />

          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {displayExperiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { FeaturedExperiencesSection };
