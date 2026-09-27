import type { BudgetTier, Destination, Experience, ExperienceCategory } from "@prisma/client";
import { decimalToNumber } from "../../lib/decimal.js";

export type ExperienceDestinationSummary = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
};

export type ExperienceListItem = {
  id: string;
  slug: string;
  title: string;
  name: string;
  destination: string;
  destinationSlug: string;
  category: string;
  categoryLabel: string;
  description: string;
  heroImage: string;
  coverImage: string;
  imageAlt: string;
  durationLabel: string | null;
  price: {
    from: number | null;
    label: string;
    tier: BudgetTier;
  };
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isSaved: boolean;
  source?: "catalog" | "provider";
  provider?: string;
  providerExperienceId?: string;
  location?: {
    city: string | null;
    country: string | null;
    latitude: number;
    longitude: number;
  };
};

export type ExperienceDetail = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  destination: ExperienceDestinationSummary;
  heroImage: string;
  images: string[];
  description: string;
  highlights: string[];
  duration: {
    label: string | null;
    minutes: number | null;
  };
  meetingPoint: string | null;
  included: string[];
  requirements: string[];
  cancellationPolicy: string | null;
  price: {
    tier: BudgetTier;
    from: number | null;
    label: string;
    currency: "USD";
  };
  reviews: {
    average: number;
    count: number;
  };
  isSaved: boolean;
};

const CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  tours: "Tours",
  outdoor: "Outdoor",
  cultural: "Culture",
  food_dining: "Food & Drink",
  attractions: "Attractions",
};

export function categoryToApi(value: ExperienceCategory): string {
  return value.replace(/_/g, "-");
}

export function categoryLabel(value: ExperienceCategory): string {
  return CATEGORY_LABELS[value];
}

function defaultPriceFrom(tier: BudgetTier, estimatedPriceFrom: number | null): number | null {
  if (estimatedPriceFrom != null) {
    return estimatedPriceFrom;
  }

  switch (tier) {
    case "budget":
      return 49;
    case "moderate":
      return 99;
    case "luxury":
      return 199;
  }
}

function experiencePriceLabel(tier: BudgetTier, priceFrom: number | null): string {
  if (priceFrom != null) {
    return `From $${priceFrom}/person`;
  }

  switch (tier) {
    case "budget":
      return "From $49/person";
    case "moderate":
      return "From $99/person";
    case "luxury":
      return "From $199/person";
  }
}

export function toExperienceDestinationSummary(
  destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">,
): ExperienceDestinationSummary {
  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    region: destination.region,
  };
}

export function toExperienceListItem(
  experience: Experience & {
    destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">;
  },
  isSaved = false,
): ExperienceListItem {
  const priceFrom = defaultPriceFrom(experience.priceTier, experience.estimatedPriceFrom);

  return {
    id: experience.id,
    slug: experience.slug,
    title: experience.title,
    name: experience.title,
    destination: experience.destination.title,
    destinationSlug: experience.destination.slug,
    category: categoryToApi(experience.category),
    categoryLabel: categoryLabel(experience.category),
    description: experience.overview,
    heroImage: experience.heroImage,
    coverImage: experience.heroImage,
    imageAlt: experience.title,
    durationLabel: experience.durationLabel,
    price: {
      from: priceFrom,
      label: experiencePriceLabel(experience.priceTier, priceFrom),
      tier: experience.priceTier,
    },
    rating: decimalToNumber(experience.ratingAvg),
    reviewCount: experience.reviewCount,
    isFeatured: experience.isFeatured,
    isSaved,
  };
}

export function toExperienceDetail(
  experience: Experience & { destination: Destination },
  isSaved = false,
): ExperienceDetail {
  const priceFrom = defaultPriceFrom(experience.priceTier, experience.estimatedPriceFrom);

  return {
    id: experience.id,
    slug: experience.slug,
    name: experience.title,
    category: categoryToApi(experience.category),
    categoryLabel: categoryLabel(experience.category),
    destination: toExperienceDestinationSummary(experience.destination),
    heroImage: experience.heroImage,
    images: experience.gallery,
    description: experience.overview,
    highlights: experience.highlights,
    duration: {
      label: experience.durationLabel,
      minutes: experience.durationMinutes,
    },
    meetingPoint: experience.meetingPoint,
    included: experience.included,
    requirements: experience.requirements,
    cancellationPolicy: experience.cancellationPolicy,
    price: {
      tier: experience.priceTier,
      from: priceFrom,
      label: experiencePriceLabel(experience.priceTier, priceFrom),
      currency: "USD",
    },
    reviews: {
      average: decimalToNumber(experience.ratingAvg),
      count: experience.reviewCount,
    },
    isSaved,
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
