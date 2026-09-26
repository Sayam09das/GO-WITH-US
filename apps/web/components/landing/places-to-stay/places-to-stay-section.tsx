"use client";

import { useMemo } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { StayListItem } from "@/types/stay";
import { PlacesToStayGrid } from "./places-to-stay-grid";
import { PlacesToStayHeader } from "./places-to-stay-header";

interface PlacesToStaySectionProps {
  stays: StayListItem[];
}

function sortStaysForDisplay(stays: StayListItem[]): StayListItem[] {
  return [...stays].sort((left, right) => {
    if (left.isFeatured && !right.isFeatured) {
      return -1;
    }
    if (!left.isFeatured && right.isFeatured) {
      return 1;
    }
    return 0;
  });
}

function PlacesToStaySection({ stays }: PlacesToStaySectionProps) {
  const reducedMotion = useReducedMotion();

  const orderedStays = useMemo(() => sortStaysForDisplay(stays), [stays]);

  if (orderedStays.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="places-to-stay-heading"
      className={cn(
        "travel-section bg-background",
        reducedMotion && "[&_[data-pts-image-mask]]:opacity-100",
      )}
    >
      <div className="container-travel">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          <PlacesToStayHeader />
          <PlacesToStayGrid stays={orderedStays} />
        </div>
      </div>
    </section>
  );
}

export { PlacesToStaySection };
