import type { BudgetTier, ExperienceCategory, PlaceCategory, PropertyType } from "@prisma/client";

export const HERO_IMAGES = [
  "/landingImg/travelimg/travel-1.jpg",
  "/landingImg/travelimg/travel-2.jpg",
  "/landingImg/travelimg/travel-3.jpg",
  "/landingImg/travelimg/travel-4.jpg",
  "/landingImg/travelimg/travel-5.jpg",
  "/landingImg/travelimg/travel-6.jpg",
  "/landingImg/travelimg/travel-7.jpg",
  "/landingImg/travelimg/travel-8.jpg",
  "/landingImg/travelimg/travel-9.jpg",
  "/landingImg/travelimg/travel-10.jpg",
  "/landingImg/travelimg/travel-11.jpg",
  "/landingImg/travelimg/travel-12.jpg",
  "/landingImg/about/about-beach.jpg",
  "/landingImg/about/about-venice.jpg",
  "/landingImg/about/about-cappadocia.jpg",
  "/landingImg/hero/hero-balloon.jpg",
  "/landingImg/hero/hero-boardwalk.jpg",
  "/landingImg/hero/hero-hiker.jpg",
  "/landingImg/hero/hero-resort.jpg",
] as const;

export function pickHeroImage(index: number): string {
  return HERO_IMAGES[index % HERO_IMAGES.length] ?? HERO_IMAGES[0];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeRating(value: number): number {
  return Math.min(Math.max(Number(value.toFixed(1)), 0), 5);
}

export function budgetTierPriceLabel(tier: BudgetTier): string {
  switch (tier) {
    case "budget":
      return "From $200";
    case "moderate":
      return "From $350";
    default:
      return "From $600";
  }
}

export const PROPERTY_TYPES: PropertyType[] = [
  "boutique_hotel",
  "villa",
  "apartment",
  "eco_lodge",
  "lodge",
];

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  "tours",
  "outdoor",
  "cultural",
  "food_dining",
  "attractions",
];

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "museum",
  "beach",
  "park",
  "market",
  "viewpoint",
  "temple",
  "historic_site",
  "neighborhood",
  "gallery",
  "natural_attraction",
];

export type DestinationSeed = {
  slug: string;
  title: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  budgetTier: BudgetTier;
  style: string;
  category: string;
  rating: number;
  popularity: number;
  featured: boolean;
  overview: string;
  highlights: string[];
  tags: string[];
};

export type CatalogIds = {
  destinations: Map<string, string>;
  stays: Map<string, string>;
  experiences: Map<string, string>;
  restaurants: Map<string, string>;
  places: Map<string, string>;
  users: Map<string, string>;
};
