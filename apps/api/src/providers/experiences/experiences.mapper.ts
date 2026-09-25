import type { BudgetTier } from "../../generated/client.js";
import type { ExperienceListItem } from "../../modules/experiences/experiences.types.js";
import type {
  NormalizedExperienceAvailability,
  NormalizedExperienceListing,
} from "./experiences.types.js";

export type ExperienceAvailabilityResult = {
  experienceId: string;
  date: string;
  startTime: string;
  guests: {
    adults: number;
    children: number;
  };
  isAvailable: boolean;
  options: Array<{
    id: string;
    label: string;
    startTime: string;
    maxGuests: number;
    priceFrom: number | null;
    available: boolean;
  }>;
  meta: {
    inventoryModel: "guidance" | "provider";
    provider?: NormalizedExperienceAvailability["source"];
  };
};

export function mapExperienceAvailabilityToResult(
  availability: NormalizedExperienceAvailability,
): ExperienceAvailabilityResult {
  return {
    experienceId: availability.experienceId,
    date: availability.date,
    startTime: availability.startTime,
    guests: availability.guests,
    isAvailable: availability.isAvailable,
    options: availability.options,
    meta: {
      inventoryModel: "provider",
      provider: availability.source,
    },
  };
}

function inferBudgetTier(priceFrom: number | null): BudgetTier {
  if (priceFrom == null) {
    return "moderate";
  }

  if (priceFrom < 75) {
    return "budget";
  }

  if (priceFrom < 150) {
    return "moderate";
  }

  return "luxury";
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

export function mapProviderListingToExperienceListItem(
  listing: NormalizedExperienceListing,
): ExperienceListItem {
  const tier = inferBudgetTier(listing.price.amount);
  const priceFrom = listing.price.amount;

  return {
    id: listing.id,
    slug: `provider-${listing.providerExperienceId}`,
    title: listing.title,
    destination: listing.location.city ?? listing.destination ?? "Nearby",
    destinationSlug: "",
    category: "tours",
    categoryLabel: "Tours",
    description: listing.description ?? listing.title,
    heroImage: listing.image ?? "",
    imageAlt: listing.title,
    durationLabel: listing.durationLabel,
    price: {
      from: priceFrom,
      label: experiencePriceLabel(tier, priceFrom),
      tier,
    },
    rating: listing.rating ?? 0,
    reviewCount: 0,
    isFeatured: false,
    isSaved: false,
    source: "provider",
    provider: listing.provider,
    providerExperienceId: listing.providerExperienceId,
    location: listing.location,
  };
}

export function mergeExperienceSearchResults(
  catalog: ExperienceListItem[],
  provider: ExperienceListItem[],
): ExperienceListItem[] {
  const catalogProviderIds = new Set(
    catalog
      .map((item) => item.providerExperienceId)
      .filter((value): value is string => Boolean(value)),
  );

  const uniqueProvider = provider.filter(
    (item) => !catalogProviderIds.has(item.providerExperienceId ?? ""),
  );

  return [...uniqueProvider, ...catalog];
}
