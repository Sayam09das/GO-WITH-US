import type { LucideIcon } from "lucide-react";
import { Bookmark, CalendarRange, Compass, MapPinned, PlaneTakeoff } from "lucide-react";

export const BUILD_YOUR_JOURNEY_COPY = {
  eyebrow: "HOW IT WORKS",
  headline: "Build Your Journey",
  emoji: "🧳",
  supporting:
    "From first spark of inspiration to a trip you are ready to take — discover, save, plan, and go at your own pace.",
  cta: "Create a Trip",
  ctaHref: "/trips/new",
} as const;

export interface JourneyStep {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  stepNumber: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "discover",
    label: "Discover",
    description: "Explore destinations, stays, and experiences curated for meaningful travel.",
    icon: Compass,
    stepNumber: "01",
  },
  {
    id: "save",
    label: "Save",
    description: "Keep the places that inspire you and build a personal shortlist over time.",
    icon: Bookmark,
    stepNumber: "02",
  },
  {
    id: "add-to-trip",
    label: "Add to Trip",
    description: "Start a trip and drop saved spots into a plan that starts taking shape.",
    icon: MapPinned,
    stepNumber: "03",
  },
  {
    id: "organize",
    label: "Organize",
    description: "Arrange days, reorder stops, and keep the rhythm of the journey yours.",
    icon: CalendarRange,
    stepNumber: "04",
  },
  {
    id: "go",
    label: "Go",
    description: "Travel with a clear itinerary when you are ready to move.",
    icon: PlaneTakeoff,
    stepNumber: "05",
  },
];
