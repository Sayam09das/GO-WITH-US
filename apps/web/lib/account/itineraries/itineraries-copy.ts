export const ITINERARIES_PAGE_COPY = {
  eyebrow: "PLAN YOUR JOURNEY",
  heading: "Itineraries",
  supporting: "Turn places you've saved into a journey worth remembering.",
  create: "Create itinerary",
  createHref: "/trips/new",
  upcomingLabel: "UPCOMING ITINERARIES",
  openItinerary: "Open itinerary",
  continuePlanning: "Continue planning",
} as const;

export const ITINERARIES_TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "drafts", label: "Drafts" },
  { id: "past", label: "Past" },
] as const;

export type ItinerariesTabId = (typeof ITINERARIES_TABS)[number]["id"];

export const ITINERARIES_EMPTY_COPY = {
  all: {
    title: "Your next journey starts with a plan.",
    description: "Choose a destination and begin building your days.",
    action: "Create itinerary",
    href: "/trips/new",
  },
  tab: {
    title: "Nothing here yet",
    description: "Switch tabs or start a new itinerary from a destination you love.",
  },
} as const;

export const ITINERARIES_BOTTOM_CTA = {
  heading: "Build your days",
  supporting: "Open an itinerary to add destinations, stays, restaurants, and experiences.",
  action: "Plan a trip",
  href: "/trips/new",
} as const;
