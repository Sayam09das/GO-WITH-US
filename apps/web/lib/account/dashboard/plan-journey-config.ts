export const PLAN_JOURNEY_SECTION_COPY = {
  eyebrow: "YOUR NEXT ESCAPE",
  heading: "Ready to go somewhere new?",
  supporting: "Find a destination, save a few places, and start shaping your next journey.",
  primaryAction: "Start exploring",
} as const;

export interface DashboardPlanJourneyVisualConfig {
  src: string;
  alt: string;
  objectPosition: string;
  moodLabel: string;
}

export const DASHBOARD_PLAN_JOURNEY_VISUAL: DashboardPlanJourneyVisualConfig = {
  src: "/landingImg/travelimg/travel-9.jpg",
  alt: "Quiet coastal road winding along limestone cliffs above the Mediterranean",
  objectPosition: "object-[center_42%]",
  moodLabel: "Open road ahead",
};

export const PLAN_JOURNEY_LINKS = {
  explore: "/account/discover",
} as const;
