"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FEATURED_EXPERIENCES_COPY,
  FEATURED_EXPERIENCES_GRID_PAGE_SIZE,
} from "@/lib/landing/featured-experiences";
import type { ExperienceListItem } from "@/types/experience";
import { ExperienceCard } from "./experience-card";

interface FeaturedExperiencesGridProps {
  experiences: ExperienceListItem[];
}

function FeaturedExperiencesGrid({ experiences }: FeaturedExperiencesGridProps) {
  const [visibleCount, setVisibleCount] = useState(FEATURED_EXPERIENCES_GRID_PAGE_SIZE);

  const visibleExperiences = useMemo(
    () => experiences.slice(0, visibleCount),
    [experiences, visibleCount],
  );
  const hasMore = visibleCount < experiences.length;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {visibleExperiences.map((experience, index) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            index={index}
            eagerLoad={index < 4}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            onClick={() => {
              setVisibleCount((current) =>
                Math.min(current + FEATURED_EXPERIENCES_GRID_PAGE_SIZE, experiences.length),
              );
            }}
          >
            {FEATURED_EXPERIENCES_COPY.viewMore}
          </Button>
        </div>
      ) : null}

      {!hasMore && experiences.length > FEATURED_EXPERIENCES_GRID_PAGE_SIZE ? (
        <p className="text-center text-sm text-muted-foreground" role="status">
          You&apos;ve seen all {experiences.length} experiences in this collection.
        </p>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {visibleExperiences.length} of {experiences.length} experiences shown
        {hasMore ? "" : ", end of list"}
      </span>
    </div>
  );
}

export { FeaturedExperiencesGrid };
