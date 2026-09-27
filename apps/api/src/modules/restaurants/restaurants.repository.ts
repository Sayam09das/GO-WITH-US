import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/db.js";
import type {
  ListRestaurantsQuery,
  RestaurantSearchInput,
  RestaurantSort,
} from "./restaurants.schemas.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function buildFilterConditions(input: {
  query?: string;
  destination?: string;
  cuisine?: string;
  cuisines?: string[];
  priceLevel?: number;
  priceLevels?: number[];
  rating?: number;
}): Prisma.RestaurantWhereInput[] {
  const conditions: Prisma.RestaurantWhereInput[] = [{ isPublished: true }];

  if (input.query?.trim()) {
    const query = input.query.trim();
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { overview: { contains: query, mode: "insensitive" } },
        { cuisine: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
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

  if (input.cuisine?.trim()) {
    conditions.push({
      cuisine: { equals: input.cuisine.trim(), mode: "insensitive" },
    });
  }

  if (input.cuisines?.length) {
    conditions.push({
      OR: input.cuisines.map((cuisine) => ({
        cuisine: { equals: cuisine, mode: "insensitive" as const },
      })),
    });
  }

  if (input.priceLevel != null) {
    conditions.push({ priceLevel: input.priceLevel });
  }

  if (input.priceLevels?.length) {
    conditions.push({ priceLevel: { in: input.priceLevels } });
  }

  if (input.rating != null) {
    conditions.push({ ratingAvg: { gte: input.rating } });
  }

  return conditions;
}

function buildOrderBy(sort: RestaurantSort): Prisma.RestaurantOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "price":
      return [{ priceLevel: "asc" }, { ratingAvg: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

const restaurantInclude = {
  destination: {
    select: {
      id: true,
      slug: true,
      title: true,
      country: true,
      region: true,
    },
  },
} satisfies Prisma.RestaurantInclude;

export const restaurantsRepository = {
  async list(input: ListRestaurantsQuery) {
    const where: Prisma.RestaurantWhereInput = {
      AND: buildFilterConditions({
        query: input.q,
        destination: input.destination,
        cuisine: input.cuisine,
        priceLevel: input.priceLevel,
        rating: input.rating,
      }),
    };

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: restaurantInclude,
        orderBy: buildOrderBy(input.sort),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.restaurant.count({ where }),
    ]);

    return { restaurants, total, page: input.page, limit: input.limit };
  },

  async search(input: RestaurantSearchInput) {
    const page = input.page ?? 1;
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const where: Prisma.RestaurantWhereInput = {
      AND: buildFilterConditions({
        query: input.query,
        destination: input.destination,
        cuisines: input.cuisines,
        priceLevels: input.priceLevel,
        rating: input.rating,
      }),
    };

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: restaurantInclude,
        orderBy: buildOrderBy(input.sort ?? "recommended"),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.restaurant.count({ where }),
    ]);

    return { restaurants, total, page, limit };
  },

  async listFeatured(limit = 12) {
    return prisma.restaurant.findMany({
      where: { isPublished: true, isFeatured: true },
      include: restaurantInclude,
      orderBy: [{ reviewCount: "desc" }, { ratingAvg: "desc" }],
      take: limit,
    });
  },

  async findBySlug(slug: string) {
    return prisma.restaurant.findFirst({
      where: { slug, isPublished: true },
      include: {
        destination: true,
      },
    });
  },

  async findByIdOrSlug(restaurantIdOrSlug: string) {
    if (isUuid(restaurantIdOrSlug)) {
      return prisma.restaurant.findFirst({
        where: { id: restaurantIdOrSlug, isPublished: true },
        include: restaurantInclude,
      });
    }

    return prisma.restaurant.findFirst({
      where: { slug: restaurantIdOrSlug, isPublished: true },
      include: restaurantInclude,
    });
  },

  async findSavedRestaurantIds(userId: string, restaurantIds: string[]) {
    if (restaurantIds.length === 0) {
      return new Set<string>();
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId,
        itemType: "restaurant",
        itemId: { in: restaurantIds },
      },
      select: { itemId: true },
    });

    return new Set(savedItems.map((item) => item.itemId));
  },
};
