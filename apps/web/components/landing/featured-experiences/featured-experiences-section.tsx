"use client";

import { useMemo } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE } from "@/lib/landing/featured-experiences";
import { cn } from "@/lib/utils";
import type { ExperienceListItem } from "@/types/experience";
import { FeaturedExperiencesGrid } from "./featured-experiences-grid";
import { FeaturedExperiencesHeader } from "./featured-experiences-header";

interface FeaturedExperiencesSectionProps {
  experiences: ExperienceListItem[];
}

function sortExperiencesForDisplay(experiences: ExperienceListItem[]): ExperienceListItem[] {
  const featured = experiences.find((item) => item.isFeatured);
  if (!featured) {
    return experiences;
  }

  return [featured, ...experiences.filter((item) => item.id !== featured.id)];
}

function FeaturedExperiencesSection({ experiences }: FeaturedExperiencesSectionProps) {
  const reducedMotion = useReducedMotion();

  const displayExperiences = useMemo(() => {
    const base = experiences.length > 0 ? experiences : FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE;
    return sortExperiencesForDisplay(base);
  }, [experiences]);

  if (displayExperiences.length === 0) {
    return null;
  }

  return (
    <section
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
          <FeaturedExperiencesGrid experiences={displayExperiences} />
        </div>
      </div>
    </section>
  );
}

export { FeaturedExperiencesSection };
