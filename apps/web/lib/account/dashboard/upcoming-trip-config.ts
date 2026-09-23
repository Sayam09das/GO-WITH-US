export interface UpcomingTripImage {
  src: string;
  alt: string;
  objectPosition: string;
}

export interface UpcomingTrip {
  id: string;
  destination: string;
  country: string;
  dateRange: string;
  nightsLabel: string;
  description: string;
  status: "confirmed";
  statusLabel: string;
  image: UpcomingTripImage;
  tripHref: string;
  itineraryHref: string;
}

export const UPCOMING_TRIP_SECTION_COPY = {
  eyebrow: "YOUR NEXT JOURNEY",
  heading: "Upcoming Trip",
  supporting: "Everything you need for your next adventure, in one place.",
  viewAllTrips: "View all trips",
  overlayLabel: "UPCOMING",
  viewTrip: "View trip",
  openItinerary: "Open itinerary",
} as const;

export const UPCOMING_TRIP_EMPTY_COPY = {
  heading: "No journeys planned yet.",
  supporting: "The world is waiting. Start planning somewhere worth going.",
  action: "Explore destinations",
} as const;

export const UPCOMING_TRIP_LINKS = {
  allTrips: "/trips",
  explore: "/account/discover",
} as const;

/** Fixture upcoming trip until trips API is wired. Set to `null` for empty state. */
export const UPCOMING_TRIP_FIXTURE: UpcomingTrip | null = {
  id: "trip-kyoto-2026",
  destination: "Kyoto, Japan",
  country: "Japan",
  dateRange: "12 — 18 October 2026",
  nightsLabel: "Japan · 6 nights",
  description: "A week of quiet temples, hidden streets, local food and slow mornings.",
  status: "confirmed",
  statusLabel: "Confirmed",
  image: {
    src: "/landingImg/travelimg/travel-5.jpg",
    alt: "Traditional Kyoto street with wooden architecture and soft morning light",
    objectPosition: "object-center",
  },
  tripHref: "/trips",
  itineraryHref: "/account/itineraries",
};
