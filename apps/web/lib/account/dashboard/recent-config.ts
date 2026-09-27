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
