/** Hero copy — aligned with docs/CONTENT_GUIDELINES.md editorial tone. */
export const HERO_COPY = {
  eyebrow: "Explore the world —",
  headline: "Discover the best destinations in the world",
  subheadline: "Find beautiful places and plan an unforgettable trip with the people you love.",
  locationLabel: "Location",
  locationPlaceholder: "Where are you going?",
  dateLabel: "Select date",
  datePlaceholder: "Pick your travel date",
  ctaLabel: "Get started",
  statDestinations: "100+ Destinations",
  statDestinationsSub: "More than 100 travelers use this platform",
  statVerified: "100% Verified",
} as const;

export type HeroImageSlot = "balloon" | "pier" | "beach" | "hiker";

export interface HeroImageConfig {
  id: HeroImageSlot;
  src: string;
  alt: string;
  /** Tailwind object-position utility for collage crop tuning. */
  objectPosition: string;
  /** Gradient fallback if the asset fails to load. */
  gradient: string;
}

/** Hero collage assets — files live in `public/hero/`. */
export const HERO_IMAGES: Record<HeroImageSlot, HeroImageConfig> = {
  balloon: {
    id: "balloon",
    src: "/hero/hero-balloon.jpg",
    alt: "Colorful hot air balloons floating over Cappadocia at sunrise",
    objectPosition: "object-center",
    gradient: "from-[#fbbf7a] via-[#f97316] to-[#ea580c]",
  },
  pier: {
    id: "pier",
    src: "/hero/hero-boardwalk.jpg",
    alt: "Traveler walking along a tropical pier toward overwater bungalows",
    objectPosition: "object-[center_20%]",
    gradient: "from-[#7dd3fc] via-[#38bdf8] to-[#0ea5e9]",
  },
  beach: {
    id: "beach",
    src: "/hero/hero-resort.jpg",
    alt: "Overwater resort bungalows along a turquoise lagoon with a mountain backdrop",
    objectPosition: "object-[center_35%]",
    gradient: "from-[#fde68a] via-[#fbbf24] to-[#f59e0b]",
  },
  hiker: {
    id: "hiker",
    src: "/hero/hero-hiker.jpg",
    alt: "Hiker photographing snow-capped mountain peaks from a rocky ridge",
    objectPosition: "object-[65%_center]",
    gradient: "from-[#cbd5e1] via-[#94a3b8] to-[#64748b]",
  },
};
