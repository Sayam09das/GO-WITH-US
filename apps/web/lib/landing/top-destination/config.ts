import type { LucideIcon } from "lucide-react";
import { CalendarDays, MapPin, Users } from "lucide-react";

export const TOP_DESTINATION_COPY = {
  eyebrow: "Top Destination —",
  headline: "Let's explore your dream destination here!",
  description:
    "We recommend standout destinations every week — so you can focus on where you want to go, not where to start looking.",
  ctaLabel: "Get started",
} as const;

export interface TopDestinationField {
  id: string;
  label: string;
  placeholder: string;
  icon: LucideIcon;
}

export const TOP_DESTINATION_FIELDS: TopDestinationField[] = [
  {
    id: "location",
    label: "Location",
    placeholder: "Where are you going?",
    icon: MapPin,
  },
  {
    id: "travelers",
    label: "Travelers",
    placeholder: "How many people?",
    icon: Users,
  },
  {
    id: "check-in",
    label: "Check in",
    placeholder: "Select date",
    icon: CalendarDays,
  },
  {
    id: "check-out",
    label: "Check out",
    placeholder: "Select date",
    icon: CalendarDays,
  },
];
