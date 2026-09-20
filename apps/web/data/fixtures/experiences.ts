import type { ExperienceListItem } from "@/types/experience";

export const EXPERIENCES_FIXTURE: ExperienceListItem[] = [
  {
    id: "exp-alpine-ridgeline-trek",
    slug: "alpine-ridgeline-trek-dolomites",
    title: "Alpine ridgeline trek",
    destination: "Dolomites, Italy",
    category: "outdoor",
    categoryLabel: "Mountain trekking",
    description:
      "Walk above the treeline as jagged peaks open around you — a slow, steady climb through alpine meadows and quiet ridgelines.",
    heroImage: "/landingImg/hero/hero-hiker.jpg",
    imageAlt: "Hiker on a mountain trail with dramatic alpine peaks in the background",
    objectPosition: "object-[center_35%]",
    isFeatured: true,
  },
  {
    id: "exp-sunset-sailing-amalfi",
    slug: "sunset-sailing-amalfi-coast",
    title: "Sunset sailing along the coast",
    destination: "Amalfi Coast, Italy",
    category: "outdoor",
    categoryLabel: "Ocean experience",
    description:
      "Drift along limestone cliffs as the light softens — water, wind, and a coastline that feels painted at the edges.",
    heroImage: "/landingImg/hero/hero-boardwalk.jpg",
    imageAlt: "Wooden boardwalk leading toward a calm coastal horizon at sunset",
    objectPosition: "object-center",
  },
  {
    id: "exp-canals-golden-hour",
    slug: "canals-golden-hour-venice",
    title: "Canals at golden hour",
    destination: "Venice, Italy",
    category: "cultural",
    categoryLabel: "Cultural walk",
    description:
      "Follow narrow waterways as the city exhales — gondolas, stone bridges, and the quiet rhythm of an evening in Venice.",
    heroImage: "/landingImg/about/about-venice.jpg",
    imageAlt: "Gondola on the Grand Canal with historic Venetian architecture",
    objectPosition: "object-[center_35%]",
  },
  {
    id: "exp-turquoise-cove-morning",
    slug: "turquoise-cove-morning-greek-islands",
    title: "Turquoise cove morning",
    destination: "Greek Islands",
    category: "outdoor",
    categoryLabel: "Hidden beach",
    description:
      "Reach a sheltered cove before the day gathers — clear water, pale stone, and the kind of stillness worth waking early for.",
    heroImage: "/landingImg/about/about-beach.jpg",
    imageAlt: "Aerial view of boats on a turquoise coastline with white sand",
    objectPosition: "object-center",
  },
];
