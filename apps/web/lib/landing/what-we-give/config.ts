import type { LucideIcon } from "lucide-react";
import { CalendarRange, Flag, Signpost } from "lucide-react";

export const WHAT_WE_GIVE_COPY = {
  eyebrow: "What We Give —",
  headline: "Best Features For You",
  description:
    "Thoughtful tools for travelers who want to discover comfortably and build trips that feel personal.",
} as const;

export interface WhatWeGiveFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

export const WHAT_WE_GIVE_FEATURES: WhatWeGiveFeature[] = [
  {
    id: "choices",
    title: "Lots of Choices",
    description:
      "Browse destinations, stays, and experiences curated for meaningful travel — not overwhelming lists.",
    icon: Signpost,
  },
  {
    id: "discovery",
    title: "Curated Discovery",
    description:
      "We surface standout places and local moments worth remembering, refreshed regularly for you.",
    icon: Flag,
    highlighted: true,
  },
  {
    id: "planning",
    title: "Easy Trip Planning",
    description:
      "Save what inspires you and shape day-by-day itineraries without the noise of a booking marketplace.",
    icon: CalendarRange,
  },
];
