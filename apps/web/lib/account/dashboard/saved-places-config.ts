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

/** Fixture saved places until saved-items API is wired. Set to `[]` for empty state. */
export const SAVED_PLACES_FIXTURE: SavedPlaceItem[] = [
  {
    id: "saved-kyoto",
    catalogId: "dest-kyoto",
    name: "Kyoto",
    location: "Kyoto",
    country: "Japan",
    type: "destination",
    typeLabel: "Destination",
    description: "Wooden streets, temple gardens, and mornings that begin without hurry.",
    detail: "From $270 / night",
    href: "/destinations/kyoto",
    image: {
      src: "/landingImg/travelimg/travel-5.jpg",
      alt: "Traditional Kyoto street with wooden architecture and soft morning light",
      objectPosition: "object-center",
    },
  },
  {
    id: "saved-cliffside-amalfi",
    catalogId: "stay-amalfi",
    name: "Cliffside House Amalfi",
    location: "Amalfi",
    country: "Italy",
    type: "stay",
    typeLabel: "Stay",
    description: "Terraces that open to sea light and evenings above the coast.",
    detail: "From $420 / night",
    href: "/stays/cliffside-house-amalfi",
    image: {
      src: "/landingImg/hero/hero-resort.jpg",
      alt: "Luxury resort terrace overlooking the Amalfi coastline at golden hour",
      objectPosition: "object-center",
    },
  },
  {
    id: "saved-sunset-sailing",
    catalogId: "exp-sailing",
    name: "Sunset sailing along the coast",
    location: "Amalfi Coast",
    country: "Italy",
    type: "experience",
    typeLabel: "Experience",
    description: "Drift along limestone cliffs as the light softens over the water.",
    detail: "Half-day · from $120",
    href: "/experiences/sunset-sailing-amalfi-coast",
    image: {
      src: "/landingImg/travelimg/travel-8.jpg",
      alt: "Calm coastal horizon at sunset with warm light over the water",
      objectPosition: "object-center",
    },
  },
];
