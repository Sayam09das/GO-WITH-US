import type { BudgetTier, Destination, Experience, Stay } from "../../generated/client.js";

export type DestinationListItem = {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  region: string;
  style: string | null;
  category: string | null;
  budgetTier: BudgetTier;
  popularity: number;
  rating: number;
  priceLabel: string;
  heroImage: string;
  imageAlt: string;
  isSaved: boolean;
};

export type DestinationStaySummary = {
  id: string;
  slug: string;
  title: string;
  propertyType: string;
  locationLabel: string;
  heroImage: string;
  priceTier: BudgetTier;
  rating: number;
};

export type DestinationExperienceSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  durationLabel: string | null;
  heroImage: string;
  priceTier: BudgetTier;
  rating: number;
};

export type DestinationDetail = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  climateNotes: string | null;
  currency: string | null;
  primaryLanguage: string | null;
  transportTips: string | null;
  budgetTier: BudgetTier;
  bestTimeToVisit: string | null;
  categoryTags: string[];
  travelStyles: string[];
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  location: {
    country: string;
    region: string;
  };
  stays: DestinationStaySummary[];
  experiences: DestinationExperienceSummary[];
  relatedDestinations: DestinationListItem[];
};

function budgetTierPriceLabel(tier: BudgetTier): string {
  switch (tier) {
    case "budget":
      return "From $200";
    case "moderate":
      return "From $350";
    case "luxury":
      return "From $600";
  }
}

function decimalToNumber(value: { toNumber(): number } | null | undefined): number {
  return value ? Number(value.toNumber()) : 0;
}

export function toDestinationListItem(
  destination: Destination,
  isSaved = false,
): DestinationListItem {
  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    location: destination.region,
    country: destination.country,
    region: destination.region,
    style: destination.travelStyles[0] ?? null,
    category: destination.categoryTags[0] ?? null,
    budgetTier: destination.budgetTier,
    popularity: destination.reviewCount,
    rating: decimalToNumber(destination.ratingAvg),
    priceLabel: budgetTierPriceLabel(destination.budgetTier),
    heroImage: destination.heroImage,
    imageAlt: destination.title,
    isSaved,
  };
}

function toStaySummary(stay: Stay): DestinationStaySummary {
  return {
    id: stay.id,
    slug: stay.slug,
    title: stay.title,
    propertyType: stay.propertyType,
    locationLabel: stay.locationLabel,
    heroImage: stay.heroImage,
    priceTier: stay.priceTier,
    rating: decimalToNumber(stay.ratingAvg),
  };
}

function toExperienceSummary(experience: Experience): DestinationExperienceSummary {
  return {
    id: experience.id,
    slug: experience.slug,
    title: experience.title,
    category: experience.category,
    durationLabel: experience.durationLabel,
    heroImage: experience.heroImage,
    priceTier: experience.priceTier,
    rating: decimalToNumber(experience.ratingAvg),
  };
}

export function toDestinationDetail(input: {
  destination: Destination & { stays: Stay[]; experiences: Experience[] };
  relatedDestinations: Destination[];
  isSaved?: boolean;
}): DestinationDetail {
  const { destination, relatedDestinations, isSaved = false } = input;

  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    region: destination.region,
    heroImage: destination.heroImage,
    gallery: destination.gallery,
    overview: destination.overview,
    highlights: destination.highlights,
    climateNotes: destination.climateNotes,
    currency: destination.currency,
    primaryLanguage: destination.primaryLanguage,
    transportTips: destination.transportTips,
    budgetTier: destination.budgetTier,
    bestTimeToVisit: destination.bestTimeToVisit,
    categoryTags: destination.categoryTags,
    travelStyles: destination.travelStyles,
    rating: decimalToNumber(destination.ratingAvg),
    reviewCount: destination.reviewCount,
    isSaved,
    location: {
      country: destination.country,
      region: destination.region,
    },
    stays: destination.stays.map(toStaySummary),
    experiences: destination.experiences.map(toExperienceSummary),
    relatedDestinations: relatedDestinations.map((item) => toDestinationListItem(item)),
  };
}

export function buildPaginationMeta(input: { page: number; limit: number; total: number }) {
  return {
    page: input.page,
    limit: input.limit,
    total: input.total,
    totalPages: Math.max(1, Math.ceil(input.total / input.limit)),
  };
}
