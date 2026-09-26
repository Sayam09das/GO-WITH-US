export const SAVED_PAGE_COPY = {
  eyebrow: "YOUR COLLECTION",
  heading: "Saved",
  supporting: "The places, stays, experiences, and stories you want to remember.",
  explore: "Explore",
  exploreHref: "/account/discover",
  viewLabel: "View",
  removedMessage: "Removed from your collection.",
} as const;

export const SAVED_TABS = [
  { id: "all", label: "All" },
  { id: "destination", label: "Destinations" },
  { id: "stay", label: "Stays" },
  { id: "experience", label: "Experiences" },
  { id: "story", label: "Stories" },
] as const;

export type SavedTabId = (typeof SAVED_TABS)[number]["id"];

export const SAVED_EMPTY_COPY = {
  all: {
    title: "Your collection is waiting.",
    description: "Save destinations, stays, experiences, and stories as you explore.",
    action: "Start exploring",
    href: "/account/discover",
  },
  category: {
    title: "Nothing saved here yet.",
    description: "Explore GO WITH US and save something that catches your eye.",
    action: "Explore",
    href: "/account/discover",
  },
} as const;

export const SAVED_BOTTOM_CTA = {
  heading: "Keep collecting moments",
  supporting: "Discover more destinations, stays, and experiences worth saving.",
  action: "Explore GO WITH US",
  href: "/account/discover",
} as const;
