export const ABOUT_COPY = {
  eyebrow: "About —",
  headline: "We recommend beautiful destinations every month",
  description:
    "Choose your dream destinations here — we surface standout places and refresh our recommendations every week.",
} as const;

export type AboutImageSlot = "venice" | "beach" | "cappadocia";

export interface AboutImageConfig {
  id: AboutImageSlot;
  src: string;
  alt: string;
  objectPosition: string;
}

export const ABOUT_IMAGES: Record<AboutImageSlot, AboutImageConfig> = {
  venice: {
    id: "venice",
    src: "/landingImg/about/about-venice.jpg",
    alt: "Gondola on the Grand Canal with the Rialto Bridge in Venice",
    objectPosition: "object-[center_35%]",
  },
  beach: {
    id: "beach",
    src: "/landingImg/about/about-beach.jpg",
    alt: "Aerial view of boats on a turquoise tropical coastline",
    objectPosition: "object-center",
  },
  cappadocia: {
    id: "cappadocia",
    src: "/landingImg/about/about-cappadocia.jpg",
    alt: "Hot air balloons floating over Cappadocia at sunrise",
    objectPosition: "object-center",
  },
};

export interface AboutStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const ABOUT_STATS: AboutStat[] = [
  { id: "explorers", value: 2000, suffix: "+", label: "Our Explorers" },
  { id: "destinations", value: 100, suffix: "+", label: "Destinations" },
  { id: "experience", value: 20, suffix: "+", label: "Years Experience" },
];
