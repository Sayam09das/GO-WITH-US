import type { BudgetTier } from "../../generated/client.js";
import type { StayListItem } from "../../modules/stays/stays.types.js";
import type {
  NormalizedAccommodationAvailability,
  NormalizedAccommodationListing,
  NormalizedPriceBreakdown,
} from "./accommodation.types.js";

const AVAILABILITY_TTL_MS = 60_000;

function inferBudgetTier(nightlyFrom: number | null): BudgetTier {
  if (nightlyFrom == null) {
    return "moderate";
  }

  if (nightlyFrom < 150) {
    return "budget";
  }

  if (nightlyFrom < 300) {
    return "moderate";
  }

  return "luxury";
}

function nightlyPriceLabel(tier: BudgetTier, nightlyFrom: number | null): string {
  if (nightlyFrom != null) {
    return `From $${nightlyFrom}/night`;
  }

  switch (tier) {
    case "budget":
      return "From $120/night";
    case "moderate":
      return "From $220/night";
    case "luxury":
      return "From $450/night";
  }
}

export function buildPriceBreakdown(input: {
  totalAmount: number | null;
  nightlyFrom: number | null;
  nights: number;
  currency?: string;
}): NormalizedPriceBreakdown {
  const currency = input.currency ?? "USD";

  if (input.totalAmount == null) {
    return {
      baseAmount: null,
      taxAmount: null,
      feeAmount: null,
      totalAmount: null,
      currency,
    };
  }

  const estimatedTax = Math.round(input.totalAmount * 0.08);
  const estimatedFee = Math.round(input.totalAmount * 0.04);
  const baseAmount = Math.max(0, input.totalAmount - estimatedTax - estimatedFee);

  return {
    baseAmount,
    taxAmount: estimatedTax,
    feeAmount: estimatedFee,
    totalAmount: input.totalAmount,
    currency,
  };
}

export function mapProviderListingToStayListItem(
  listing: NormalizedAccommodationListing,
): StayListItem {
  const tier = inferBudgetTier(listing.nightlyFrom);

  return {
    id: listing.id,
    name: listing.name,
    slug: `provider-${listing.providerPropertyId}`,
    destination: listing.location.city ?? listing.location.country ?? "Nearby",
    destinationSlug: "",
    propertyType: listing.propertyType ?? "boutique-hotel",
    coverImage: listing.image ?? "",
    imageAlt: listing.name,
    price: {
      nightlyFrom: listing.nightlyFrom,
      label: nightlyPriceLabel(tier, listing.nightlyFrom),
      tier,
    },
    rating: listing.rating ?? 0,
    reviewCount: 0,
    amenities: listing.amenities,
    isSaved: false,
    source: "provider",
    provider: listing.provider,
    providerPropertyId: listing.providerPropertyId,
    location: listing.location,
  };
}

export function mergeStaySearchResults(
  catalog: StayListItem[],
  provider: StayListItem[],
): StayListItem[] {
  const catalogProviderIds = new Set(
    catalog
      .map((item) => item.providerPropertyId)
      .filter((value): value is string => Boolean(value)),
  );

  const uniqueProvider = provider.filter(
    (item) => !catalogProviderIds.has(item.providerPropertyId ?? ""),
  );

  return [...uniqueProvider, ...catalog];
}

export function mapAccommodationAvailabilityToStayResult(
  availability: NormalizedAccommodationAvailability,
) {
  return {
    stayId: availability.stayId,
    checkIn: availability.checkIn,
    checkOut: availability.checkOut,
    guests: availability.guests,
    roomCount: availability.roomCount,
    nights: availability.nights,
    isAvailable: availability.isAvailable,
    rooms: availability.options.map((room) => ({
      id: room.id,
      name: room.name,
      description: "",
      maxGuests: room.maxGuests,
      bedType: "",
      nightlyFrom: room.nightlyFrom,
      amenities: [],
      totalPrice: room.totalPrice,
      available: room.available,
      price: room.price,
      cancellationPolicy: room.cancellationPolicy,
    })),
    meta: {
      inventoryModel: "provider" as const,
      provider: availability.source,
      fetchedAt: availability.fetchedAt,
      expiresAt: availability.expiresAt,
    },
  };
}

export function buildAvailabilityTimestamps(ttlMs = AVAILABILITY_TTL_MS): {
  fetchedAt: string;
  expiresAt: string;
} {
  const fetchedAt = new Date();
  const expiresAt = new Date(fetchedAt.getTime() + ttlMs);

  return {
    fetchedAt: fetchedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}
