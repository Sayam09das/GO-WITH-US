import type { BudgetTier, Destination, Experience, PropertyType, Stay } from "@prisma/client";
import { decimalToNumber } from "../../lib/decimal.js";

export type StayDestinationSummary = {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
};

export type StayListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  propertyType: string;
  description: string;
  coverImage: string;
  imageAlt: string;
  price: {
    nightlyFrom: number | null;
    label: string;
    tier: BudgetTier;
  };
  rating: number;
  reviewCount: number;
  amenities: string[];
  isFeatured: boolean;
  isSaved: boolean;
  source?: "catalog" | "provider";
  provider?: string;
  providerPropertyId?: string;
  location?: {
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  };
};

export type StayRoomOption = {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  bedType: string;
  nightlyFrom: number | null;
  amenities: string[];
};

export type StayExperienceSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  durationLabel: string | null;
  heroImage: string;
  priceTier: BudgetTier;
  rating: number;
};

export type StayReviewSummary = {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type StayDetail = {
  id: string;
  slug: string;
  name: string;
  propertyType: string;
  locationLabel: string;
  heroImage: string;
  gallery: string[];
  description: string;
  amenities: string[];
  destination: StayDestinationSummary;
  pricing: {
    tier: BudgetTier;
    nightlyFrom: number | null;
    label: string;
    currency: "USD";
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
  };
  rooms: StayRoomOption[];
  availability: {
    guidanceOnly: true;
    message: string;
  };
  reviews: {
    average: number;
    count: number;
  };
  nearbyExperiences: StayExperienceSummary[];
  isSaved: boolean;
};

export type StayAvailabilityResult = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  roomCount: number;
  nights: number;
  isAvailable: boolean;
  rooms: Array<
    StayRoomOption & {
      totalPrice: number | null;
      available: boolean;
      price?: {
        baseAmount: number | null;
        taxAmount: number | null;
        feeAmount: number | null;
        totalAmount: number | null;
        currency: string;
      };
      cancellationPolicy?: string | null;
    }
  >;
  meta: {
    inventoryModel: "guidance";
  };
};

function propertyTypeToApi(value: PropertyType): string {
  return value.replace(/_/g, "-");
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

function defaultNightlyFrom(tier: BudgetTier, nightlyFrom: number | null): number | null {
  if (nightlyFrom != null) {
    return nightlyFrom;
  }

  switch (tier) {
    case "budget":
      return 120;
    case "moderate":
      return 220;
    case "luxury":
      return 450;
  }
}

function buildRoomOptions(stay: Stay): StayRoomOption[] {
  const nightlyFrom = defaultNightlyFrom(stay.priceTier, stay.estimatedNightlyFrom);
  const baseAmenities = stay.amenities.slice(0, 4);

  switch (stay.propertyType) {
    case "villa":
      return [
        {
          id: `${stay.id}-villa`,
          name: "Private Villa",
          description: "Entire villa with pool access and dedicated host support.",
          maxGuests: 6,
          bedType: "King + Twin",
          nightlyFrom,
          amenities: baseAmenities,
        },
      ];
    case "apartment":
      return [
        {
          id: `${stay.id}-studio`,
          name: "Studio Apartment",
          description: "Compact city stay with kitchenette and workspace.",
          maxGuests: 2,
          bedType: "Queen",
          nightlyFrom,
          amenities: baseAmenities,
        },
        {
          id: `${stay.id}-one-bedroom`,
          name: "One-Bedroom Suite",
          description: "Separate living area with balcony views.",
          maxGuests: 3,
          bedType: "King",
          nightlyFrom: nightlyFrom != null ? nightlyFrom + 40 : null,
          amenities: baseAmenities,
        },
      ];
    default:
      return [
        {
          id: `${stay.id}-standard`,
          name: "Standard Room",
          description: "Comfortable room with essential amenities.",
          maxGuests: 2,
          bedType: "Queen",
          nightlyFrom,
          amenities: baseAmenities,
        },
        {
          id: `${stay.id}-deluxe`,
          name: "Deluxe Room",
          description: "Extra space with premium bedding and better views.",
          maxGuests: 3,
          bedType: "King",
          nightlyFrom: nightlyFrom != null ? nightlyFrom + 60 : null,
          amenities: baseAmenities,
        },
      ];
  }
}

export function toStayDestinationSummary(
  destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region">,
): StayDestinationSummary {
  return {
    id: destination.id,
    slug: destination.slug,
    title: destination.title,
    country: destination.country,
    region: destination.region,
  };
}

export function toStayListItem(
  stay: Stay & { destination: Pick<Destination, "id" | "slug" | "title" | "country" | "region"> },
  isSaved = false,
): StayListItem {
  const nightlyFrom = defaultNightlyFrom(stay.priceTier, stay.estimatedNightlyFrom);

  return {
    id: stay.id,
    name: stay.title,
    slug: stay.slug,
    destination: stay.destination.title,
    destinationSlug: stay.destination.slug,
    propertyType: propertyTypeToApi(stay.propertyType),
    description: stay.overview,
    coverImage: stay.heroImage,
    imageAlt: stay.title,
    price: {
      nightlyFrom,
      label: nightlyPriceLabel(stay.priceTier, nightlyFrom),
      tier: stay.priceTier,
    },
    rating: decimalToNumber(stay.ratingAvg),
    reviewCount: stay.reviewCount,
    amenities: stay.amenities,
    isFeatured: stay.isFeatured,
    isSaved,
  };
}

function toExperienceSummary(experience: Experience): StayExperienceSummary {
  return {
    id: experience.id,
    slug: experience.slug,
    title: experience.title,
    category: experience.category.replace(/_/g, "-"),
    durationLabel: experience.durationLabel,
    heroImage: experience.heroImage,
    priceTier: experience.priceTier,
    rating: decimalToNumber(experience.ratingAvg),
  };
}

export function toStayDetail(
  stay: Stay & { destination: Destination },
  nearbyExperiences: Experience[],
  isSaved = false,
): StayDetail {
  const nightlyFrom = defaultNightlyFrom(stay.priceTier, stay.estimatedNightlyFrom);

  return {
    id: stay.id,
    slug: stay.slug,
    name: stay.title,
    propertyType: propertyTypeToApi(stay.propertyType),
    locationLabel: stay.locationLabel,
    heroImage: stay.heroImage,
    gallery: stay.gallery,
    description: stay.overview,
    amenities: stay.amenities,
    destination: toStayDestinationSummary(stay.destination),
    pricing: {
      tier: stay.priceTier,
      nightlyFrom,
      label: nightlyPriceLabel(stay.priceTier, nightlyFrom),
      currency: "USD",
    },
    policies: {
      checkIn: "From 3:00 PM",
      checkOut: "Until 11:00 AM",
      cancellation: "Free cancellation up to 7 days before arrival.",
      children: "Children of all ages are welcome. Extra beds may be available on request.",
    },
    rooms: buildRoomOptions(stay),
    availability: {
      guidanceOnly: true,
      message:
        "Availability is guidance-only in MVP. Use the availability query for room options by date.",
    },
    reviews: {
      average: decimalToNumber(stay.ratingAvg),
      count: stay.reviewCount,
    },
    nearbyExperiences: nearbyExperiences.map(toExperienceSummary),
    isSaved,
  };
}

export function buildStayAvailability(input: {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number };
  rooms?: number;
}): StayAvailabilityResult {
  const checkInDate = new Date(`${input.checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${input.checkOut}T00:00:00.000Z`);
  const nights = Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalGuests = input.guests.adults + input.guests.children;
  const rooms = buildRoomOptions(input.stay);

  return {
    stayId: input.stay.id,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    roomCount: input.rooms ?? 1,
    nights,
    isAvailable: rooms.some((room) => room.maxGuests >= totalGuests),
    rooms: rooms.map((room) => ({
      ...room,
      totalPrice: room.nightlyFrom != null ? room.nightlyFrom * nights : null,
      available: room.maxGuests >= totalGuests,
    })),
    meta: {
      inventoryModel: "guidance",
    },
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
