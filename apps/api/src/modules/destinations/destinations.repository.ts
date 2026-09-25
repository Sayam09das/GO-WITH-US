import type { BudgetTier, Destination, Experience, Prisma, Stay } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import type { DestinationSearchInput, DestinationSort } from "./destinations.schemas.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function mapPriceRangeToBudgetTiers(priceRange?: { min?: number; max?: number }): BudgetTier[] {
  if (!priceRange) {
    return [];
  }

  const min = priceRange.min ?? 0;
  const max = priceRange.max ?? Number.POSITIVE_INFINITY;
  const tiers: BudgetTier[] = [];

  if (min <= 300 && max >= 0) {
    tiers.push("budget");
  }
  if (min <= 600 && max >= 250) {
    tiers.push("moderate");
  }
  if (max >= 500) {
    tiers.push("luxury");
  }

  return [...new Set(tiers)];
}

function buildSearchWhere(input: DestinationSearchInput): Prisma.DestinationWhereInput {
  const conditions: Prisma.DestinationWhereInput[] = [{ isPublished: true }];

  if (input.query?.trim()) {
    const query = input.query.trim();
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { overview: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
        { region: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (input.countries?.length) {
    conditions.push({
      OR: input.countries.map((country) => ({
        country: { equals: country, mode: "insensitive" },
      })),
    });
  }

  if (input.regions?.length) {
    conditions.push({
      OR: input.regions.map((region) => ({
        region: { equals: region, mode: "insensitive" },
      })),
    });
  }

  if (input.categories?.length) {
    conditions.push({
      categoryTags: {
        hasSome: input.categories.map((category) => category.toLowerCase()),
      },
    });
  }

  const budgetTiers = mapPriceRangeToBudgetTiers(input.priceRange);
  if (budgetTiers.length > 0) {
    conditions.push({ budgetTier: { in: budgetTiers } });
  }

  return { AND: conditions };
}

function buildOrderBy(sort: DestinationSort): Prisma.DestinationOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "name":
      return [{ title: "asc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

export const destinationsRepository = {
  async list(input: { page: number; limit: number; featured?: boolean; sort: DestinationSort }) {
    const where: Prisma.DestinationWhereInput = {
      isPublished: true,
      ...(input.featured ? { isFeatured: true } : {}),
    };

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: buildOrderBy(input.sort),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.destination.count({ where }),
    ]);

    return { destinations, total };
  },

  async search(input: DestinationSearchInput) {
    const page = input.page ?? 1;
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const where = buildSearchWhere(input);

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        orderBy: buildOrderBy(input.sort ?? "popular"),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.destination.count({ where }),
    ]);

    return { destinations, total, page, limit };
  },

  async listFeatured(limit = 8) {
    return prisma.destination.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: [{ reviewCount: "desc" }, { ratingAvg: "desc" }],
      take: limit,
    });
  },

  async listCategories() {
    const destinations = await prisma.destination.findMany({
      where: { isPublished: true },
      select: { categoryTags: true },
    });

    const categories = new Set<string>();

    for (const destination of destinations) {
      for (const tag of destination.categoryTags) {
        if (tag.trim()) {
          categories.add(tag.trim());
        }
      }
    }

    return [...categories].sort((left, right) => left.localeCompare(right));
  },

  async findBySlug(slug: string) {
    return prisma.destination.findFirst({
      where: { slug, isPublished: true },
      include: {
        stays: {
          where: { isPublished: true },
          orderBy: [{ isFeatured: "desc" }, { reviewCount: "desc" }],
          take: 6,
        },
        experiences: {
          where: { isPublished: true },
          orderBy: [{ isFeatured: "desc" }, { reviewCount: "desc" }],
          take: 6,
        },
      },
    });
  },

  async findRelated(destination: Destination, limit = 4) {
    return prisma.destination.findMany({
      where: {
        isPublished: true,
        id: { not: destination.id },
        OR: [{ region: destination.region }, { country: destination.country }],
      },
      orderBy: [{ isFeatured: "desc" }, { ratingAvg: "desc" }],
      take: limit,
    });
  },

  async findSavedDestinationIds(userId: string, destinationIds: string[]) {
    if (destinationIds.length === 0) {
      return new Set<string>();
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId,
        itemType: "destination",
        itemId: { in: destinationIds },
      },
      select: { itemId: true },
    });

    return new Set(savedItems.map((item) => item.itemId));
  },
};

export type DestinationWithRelations = Destination & {
  stays: Stay[];
  experiences: Experience[];
};
