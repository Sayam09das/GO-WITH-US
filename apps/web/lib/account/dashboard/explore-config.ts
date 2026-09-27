export interface ExploreDestinationPanel {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  descriptor: string;
  image: {
    src: string;
    alt: string;
    objectPosition: string;
  };
  layout: "featured" | "compact";
}

export const EXPLORE_SECTION_COPY = {
  eyebrow: "KEEP EXPLORING",
  heading: "Places worth going",
  supporting: "Discover destinations that might belong on your next journey.",
  viewAll: "Explore all",
  discover: "Discover",
  saveLabel: "Save destination",
  unsaveLabel: "Remove from saved",
} as const;

export const EXPLORE_SECTION_LINKS = {
  viewAll: "/account/discover",
} as const;

export const EXPLORE_DESTINATION_PANELS: ExploreDestinationPanel[] = [
  {
    id: "explore-kyoto",
    slug: "kyoto",
    name: "Kyoto",
    location: "Kyoto",
    country: "Japan",
    descriptor: "Temples, tea houses, and unhurried mornings in the old capital.",
    layout: "featured",
    image: {
      src: "/landingImg/travelimg/travel-5.jpg",
      alt: "Traditional Kyoto street with wooden architecture and soft morning light",
      objectPosition: "object-center",
    },
  },
  {
    id: "explore-amalfi",
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    location: "Amalfi",
    country: "Italy",
    descriptor: "Cliffside roads, lemon groves, and long lunches above the sea.",
    layout: "compact",
    image: {
      src: "/landingImg/travelimg/travel-9.jpg",
      alt: "Scenic coastal road along limestone cliffs above the Mediterranean",
      objectPosition: "object-center",
    },
  },
  {
    id: "explore-ubud",
    slug: "bali",
    name: "Ubud",
    location: "Ubud",
    country: "Indonesia",
    descriptor: "Rice terraces, jungle light, and a slower rhythm in the hills.",
    layout: "compact",
    image: {
      src: "/landingImg/travelimg/travel-12.jpg",
      alt: "Palm-lined tropical coastline in Bali at golden hour",
      objectPosition: "object-center",
    },
  },
];
