export type SavedPlaceType = "destination" | "stay" | "experience" | "story";

export interface SavedPlaceItem {
  id: string;
  catalogId: string;
  name: string;
  location: string;
  country: string;
  type: SavedPlaceType;
  typeLabel: string;
  description: string;
  detail?: string;
  href: string;
  image: {
    src: string;
    alt: string;
    objectPosition: string;
  };
}

export const SAVED_PLACES_SECTION_COPY = {
  eyebrow: "YOUR COLLECTION",
  heading: "Places you've saved",
  supporting: "Keep the places that caught your eye close to your next journey.",
  viewAll: "View all saved",
  explore: "Explore",
  saveLabel: "Saved",
  unsaveLabel: "Remove from saved",
} as const;

export const SAVED_PLACES_EMPTY_COPY = {
  heading: "Nothing saved yet.",
  supporting: "When a place feels like somewhere you could go, save it here.",
  action: "Discover destinations",
} as const;

export const SAVED_PLACES_LINKS = {
  viewAll: "/saved",
  discover: "/account/discover",
} as const;
