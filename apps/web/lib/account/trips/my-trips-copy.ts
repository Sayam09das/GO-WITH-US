export const MY_TRIPS_PAGE_COPY = {
  eyebrow: "YOUR JOURNEYS",
  heading: "My Trips",
  supporting: "Keep track of where you've been and where you're going next.",
  planTrip: "Plan a trip",
} as const;

export const MY_TRIPS_TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export type MyTripsTabId = (typeof MY_TRIPS_TABS)[number]["id"];

export const MY_TRIPS_SECTION_COPY = {
  upcomingLabel: "UPCOMING",
  pastHeading: "Past journeys",
  viewTrip: "View trip",
  openItinerary: "Open itinerary",
  planAnother: "Plan another trip",
  includesHeading: "Your trip includes",
  includesCategories: [
    { key: "stay", label: "Stay" },
    { key: "experience", label: "Experiences" },
    { key: "restaurant", label: "Restaurants" },
    { key: "places", label: "Places to visit" },
  ],
} as const;

export const MY_TRIPS_EMPTY_COPY = {
  upcoming: {
    title: "Your next journey is waiting.",
    description: "You haven't planned your next escape yet.",
    action: "Explore destinations",
    href: "/account/discover",
  },
  past: {
    title: "Your travel story starts here.",
    description: "Once you've completed a trip, you'll find it here.",
  },
  cancelled: {
    title: "No cancelled trips",
    description: "Trips you cancel will appear here for your records.",
  },
} as const;

export const MY_TRIPS_BOTTOM_CTA = {
  heading: "Where should we go next?",
  supporting: "Discover a new destination and start planning your next journey.",
  action: "Explore destinations",
  href: "/account/discover",
} as const;
