import type { ExperienceListItem } from "@/types/experience";

/** Editorial homepage grid when the catalog API is empty or unreachable. */
export const FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE: ExperienceListItem[] = [
  {
    id: "showcase-alpine-ridgeline-trek",
    slug: "alpine-ridgeline-trek-dolomites",
    title: "Alpine ridgeline trek",
    destination: "Dolomites, Italy",
    category: "outdoor",
    categoryLabel: "Mountain trekking",
    description:
      "Walk above the treeline as jagged peaks open around you — a slow, steady climb through alpine meadows and quiet ridgelines.",
    isFeatured: true,
    heroImage: "/landingImg/travelimg/travel-7.jpg",
    imageAlt: "Hiker on a mountain trail with dramatic alpine peaks in the background",
    objectPosition: "object-center",
  },
  {
    id: "showcase-sunset-sailing-amalfi",
    slug: "sunset-sailing-amalfi-coast",
    title: "Sunset sailing along the coast",
    destination: "Amalfi Coast, Italy",
    category: "outdoor",
    categoryLabel: "Ocean experience",
    description:
      "Drift along limestone cliffs as the light softens — water, wind, and a coastline that feels painted at the edges.",
    heroImage: "/landingImg/travelimg/travel-8.jpg",
    imageAlt: "Calm coastal horizon at sunset with warm light over the water",
    objectPosition: "object-center",
  },
  {
    id: "showcase-canals-golden-hour",
    slug: "canals-golden-hour-venice",
    title: "Canals at golden hour",
    destination: "Venice, Italy",
    category: "cultural",
    categoryLabel: "Cultural walk",
    description:
      "Follow narrow waterways as the city exhales — gondolas, stone bridges, and the quiet rhythm of an evening in Venice.",
    heroImage: "/landingImg/travelimg/travel-9.jpg",
    imageAlt: "Historic canal scene with boats and stone architecture at golden hour",
    objectPosition: "object-center",
  },
  {
    id: "showcase-turquoise-cove-morning",
    slug: "turquoise-cove-morning-greek-islands",
    title: "Turquoise cove morning",
    destination: "Greek Islands",
    category: "outdoor",
    categoryLabel: "Hidden beach",
    description:
      "Reach a sheltered cove before the day gathers — clear water, pale stone, and the kind of stillness worth waking early for.",
    heroImage: "/landingImg/travelimg/travel-10.jpg",
    imageAlt: "Turquoise cove with white sand and clear shallow water",
    objectPosition: "object-center",
  },
];
