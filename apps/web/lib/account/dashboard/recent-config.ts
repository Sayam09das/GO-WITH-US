export type RecentlyViewedType = "destination" | "stay" | "experience";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  location: string;
  country: string;
  type: RecentlyViewedType;
  typeLabel: string;
  href: string;
  image: {
    src: string;
    alt: string;
    objectPosition: string;
  };
}

export const RECENTLY_VIEWED_SECTION_COPY = {
  eyebrow: "KEEP BROWSING",
  heading: "Recently viewed",
  supporting: "Pick up where you left off.",
  viewHistory: "View history",
  viewedRecently: "Viewed recently",
} as const;

export const RECENTLY_VIEWED_EMPTY_COPY = {
  heading: "Your browsing journey starts here.",
  supporting: "Explore destinations and stays, and the places you visit will appear here.",
  action: "Start exploring",
} as const;

export const RECENTLY_VIEWED_LINKS = {
  history: "/account/recent",
  explore: "/account/discover",
} as const;

/** Fixture recently viewed items until browsing history API is wired. Set to `[]` for empty state. */
export const RECENTLY_VIEWED_FIXTURE: RecentlyViewedItem[] = [
  {
    id: "recent-amalfi-coast",
    name: "Amalfi Coast",
    location: "Amalfi",
    country: "Italy",
    type: "destination",
    typeLabel: "Destination",
    href: "/destinations/amalfi-coast",
    image: {
      src: "/landingImg/travelimg/travel-9.jpg",
      alt: "Scenic coastal road along limestone cliffs above the Mediterranean",
      objectPosition: "object-center",
    },
  },
  {
    id: "recent-cliffside-amalfi",
    name: "Cliffside House Amalfi",
    location: "Amalfi",
    country: "Italy",
    type: "stay",
    typeLabel: "Stay",
    href: "/stays/cliffside-house-amalfi",
    image: {
      src: "/landingImg/hero/hero-resort.jpg",
      alt: "Luxury resort terrace overlooking the Amalfi coastline at golden hour",
      objectPosition: "object-center",
    },
  },
  {
    id: "recent-dolomites",
    name: "Dolomites",
    location: "Trentino",
    country: "Italy",
    type: "destination",
    typeLabel: "Destination",
    href: "/destinations/dolomites",
    image: {
      src: "/landingImg/travelimg/travel-7.jpg",
      alt: "Hiker on an alpine trail with mountain peaks in the distance",
      objectPosition: "object-center",
    },
  },
  {
    id: "recent-sunset-sailing",
    name: "Sunset sailing",
    location: "Amalfi Coast",
    country: "Italy",
    type: "experience",
    typeLabel: "Experience",
    href: "/experiences/sunset-sailing-amalfi-coast",
    image: {
      src: "/landingImg/travelimg/travel-8.jpg",
      alt: "Calm coastal horizon at sunset with warm light over the water",
      objectPosition: "object-center",
    },
  },
];
