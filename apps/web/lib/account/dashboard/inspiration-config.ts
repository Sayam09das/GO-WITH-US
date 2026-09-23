export interface DashboardInspirationFeatured {
  slug: string;
  title: string;
  categoryLabel: string;
  readLabel: string;
  excerpt: string;
  heroImage: string;
  imageAlt: string;
  objectPosition: string;
}

export const INSPIRATION_SECTION_COPY = {
  eyebrow: "FROM THE JOURNAL",
  heading: "Travel inspiration",
  supporting: "Stories, places, and ideas for wherever you go next.",
  viewAll: "View all stories",
  readStory: "Read story",
} as const;

export const INSPIRATION_SECTION_LINKS = {
  viewAll: "/journal",
  story: (slug: string) => `/journal/${slug}` as const,
} as const;

/** Dashboard featured editorial — distinct headline for the account overview. */
export const DASHBOARD_INSPIRATION_FEATURED: DashboardInspirationFeatured = {
  slug: "kyoto-weekend-pace",
  title: "The places worth slowing down for",
  categoryLabel: "Editorial",
  readLabel: "8 min read",
  excerpt: "A collection of quiet destinations where the journey matters as much as the arrival.",
  heroImage: "/landingImg/travelimg/travel-5.jpg",
  imageAlt: "Traditional Kyoto street with wooden architecture and soft morning light",
  objectPosition: "object-center",
};

/** Number of supporting stories shown beside the featured piece. */
export const DASHBOARD_INSPIRATION_SUPPORTING_COUNT = 2;
