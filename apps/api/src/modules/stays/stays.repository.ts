import type { Prisma, PropertyType } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import type { ListStaysQuery, StaySearchInput, StaySort } from "./stays.schemas.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function mapPropertyType(value: ListStaysQuery["propertyType"]): PropertyType | undefined {
  if (!value) {
    return undefined;
  }

  return value.replace(/-/g, "_") as PropertyType;
}

function buildFilterConditions(input: {
  query?: string;
  destination?: string;
  propertyType?: ListStaysQuery["propertyType"];
  budgetTier?: ListStaysQuery["budgetTier"];
  amenities?: string[];
  rating?: number;
  priceRange?: { min?: number; max?: number };
}): Prisma.StayWhereInput[] {
  const conditions: Prisma.StayWhereInput[] = [{ isPublished: true }];

  if (input.query?.trim()) {
    const query = input.query.trim();
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { overview: { contains: query, mode: "insensitive" } },
        { locationLabel: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (input.destination?.trim()) {
    const destination = input.destination.trim();
    conditions.push({
      destination: {
        OR: [
          { slug: { equals: destination, mode: "insensitive" } },
          { title: { contains: destination, mode: "insensitive" } },
        ],
      },
    });
  }

  const propertyType = mapPropertyType(input.propertyType);
  if (propertyType) {
    conditions.push({ propertyType });
  }

  if (input.budgetTier) {
    conditions.push({ priceTier: input.budgetTier });
  }

  if (input.amenities?.length) {
    conditions.push({
      amenities: {
        hasSome: input.amenities.map((amenity) => amenity.toLowerCase()),
      },
    });
  }

  if (input.rating != null) {
    conditions.push({ ratingAvg: { gte: input.rating } });
  }

  if (input.priceRange) {
    const min = input.priceRange.min;
    const max = input.priceRange.max;

    if (min != null || max != null) {
      conditions.push({
        OR: [
          {
            estimatedNightlyFrom:
              min != null && max != null
                ? { gte: min, lte: max }
                : min != null
                  ? { gte: min }
                  : { lte: max },
          },
          ...(min != null && min <= 150
            ? [{ priceTier: "budget" as const, estimatedNightlyFrom: null }]
            : []),
          ...(min != null && min <= 300 && (max == null || max >= 150)
            ? [{ priceTier: "moderate" as const, estimatedNightlyFrom: null }]
            : []),
          ...(max == null || max >= 300
            ? [{ priceTier: "luxury" as const, estimatedNightlyFrom: null }]
            : []),
        ],
      });
    }
  }

  return conditions;
}

function buildOrderBy(sort: StaySort): Prisma.StayOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "price":
      return [{ estimatedNightlyFrom: "asc" }, { priceTier: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

const stayInclude = {
  destination: {
    select: {
      id: true,
      slug: true,
      title: true,
      country: true,
      region: true,
    },
  },
} satisfies Prisma.StayInclude;

export const staysRepository = {
  async list(input: ListStaysQuery) {
    const where: Prisma.StayWhereInput = {
      AND: buildFilterConditions(input),
    };

    const [stays, total] = await Promise.all([
      prisma.stay.findMany({
        where,
        include: stayInclude,
        orderBy: buildOrderBy(input.sort),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.stay.count({ where }),
    ]);

    return { stays, total, page: input.page, limit: input.limit };
  },

  async search(input: StaySearchInput) {
    const page = input.page ?? 1;
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const where: Prisma.StayWhereInput = {
      AND: buildFilterConditions({
        query: input.query,
        destination: input.destination,
        amenities: input.amenities?.map((amenity) => amenity.toLowerCase()),
        rating: input.rating,
        priceRange: input.priceRange,
      }),
    };

    const [stays, total] = await Promise.all([
      prisma.stay.findMany({
        where,
        include: stayInclude,
        orderBy: buildOrderBy(input.sort ?? "recommended"),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stay.count({ where }),
    ]);

    return { stays, total, page, limit };
  },

  async findBySlug(slug: string) {
    return prisma.stay.findFirst({
      where: { slug, isPublished: true },
      include: {
        destination: true,
      },
    });
  },

  async findByIdOrSlug(stayIdOrSlug: string) {
    if (isUuid(stayIdOrSlug)) {
      return prisma.stay.findFirst({
        where: { id: stayIdOrSlug, isPublished: true },
        include: stayInclude,
      });
    }

    return prisma.stay.findFirst({
      where: { slug: stayIdOrSlug, isPublished: true },
      include: stayInclude,
    });
  },

  async findNearbyExperiences(destinationId: string, limit = 6) {
    return prisma.experience.findMany({
      where: { destinationId, isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { reviewCount: "desc" }],
      take: limit,
    });
  },

  async findSavedStayIds(userId: string, stayIds: string[]) {
    if (stayIds.length === 0) {
      return new Set<string>();
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId,
        itemType: "stay",
        itemId: { in: stayIds },
      },
      select: { itemId: true },
    });

    return new Set(savedItems.map((item) => item.itemId));
  },

  async listReviews(stayId: string, page: number, limit: number) {
    const where = { itemType: "stay" as const, itemId: stayId };

    const [reviews, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return { reviews, total, aggregate };
  },

  async findExistingReview(userId: string, stayId: string) {
    return prisma.review.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: "stay",
          itemId: stayId,
        },
      },
    });
  },

  async isUserEligibleToReviewStay(userId: string, stayId: string) {
    const [itineraryItem, bookedActivity] = await Promise.all([
      prisma.itineraryItem.findFirst({
        where: {
          itemType: "stay",
          itemId: stayId,
          trip: { userId },
        },
        select: { id: true },
      }),
      prisma.userActivity.findFirst({
        where: {
          userId,
          type: "BOOKED_STAY",
          metadata: {
            path: ["stayId"],
            equals: stayId,
          },
        },
        select: { id: true },
      }),
    ]);

    return Boolean(itineraryItem || bookedActivity);
  },

  async createReview(input: { userId: string; stayId: string; rating: number; body?: string }) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          userId: input.userId,
          itemType: "stay",
          itemId: input.stayId,
          rating: input.rating,
          body: input.body,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { itemType: "stay", itemId: input.stayId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.stay.update({
        where: { id: input.stayId },
        data: {
          ratingAvg: aggregate._avg.rating,
          reviewCount: aggregate._count.rating,
        },
      });

      return review;
    });
  },
};
