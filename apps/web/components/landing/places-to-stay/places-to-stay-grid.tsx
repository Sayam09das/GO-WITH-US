"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PLACES_TO_STAY_COPY, PLACES_TO_STAY_GRID_PAGE_SIZE } from "@/lib/landing/places-to-stay";
import type { StayListItem } from "@/types/stay";
import { PlacesToStayGridCard } from "./places-to-stay-grid-card";

interface PlacesToStayGridProps {
  stays: StayListItem[];
}

function PlacesToStayGrid({ stays }: PlacesToStayGridProps) {
  const [visibleCount, setVisibleCount] = useState(PLACES_TO_STAY_GRID_PAGE_SIZE);

  const visibleStays = useMemo(() => stays.slice(0, visibleCount), [stays, visibleCount]);
  const hasMore = visibleCount < stays.length;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
        {visibleStays.map((stay, index) => (
          <PlacesToStayGridCard key={stay.id} stay={stay} index={index} eagerLoad={index < 3} />
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
                Math.min(current + PLACES_TO_STAY_GRID_PAGE_SIZE, stays.length),
              );
            }}
          >
            {PLACES_TO_STAY_COPY.viewMore}
          </Button>
        </div>
      ) : null}

      {!hasMore && stays.length > PLACES_TO_STAY_GRID_PAGE_SIZE ? (
        <p className="text-center text-sm text-muted-foreground" role="status">
          You&apos;ve seen all {stays.length} stays in this collection.
        </p>
      ) : null}

      {/* Hint for screen readers when loading more */}
      <span className="sr-only" aria-live="polite">
        {visibleStays.length} of {stays.length} stays shown
        {hasMore ? "" : ", end of list"}
      </span>
    </div>
  );
}

export { PlacesToStayGrid };
