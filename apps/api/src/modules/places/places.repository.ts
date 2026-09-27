import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/db.js";
import type { ListPlacesQuery, PlaceSearchInput, PlaceSort } from "./places.schemas.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function buildFilterConditions(input: {
  query?: string;
  destination?: string;
  category?: string;
  categories?: string[];
  rating?: number;
}): Prisma.PlaceWhereInput[] {
  const conditions: Prisma.PlaceWhereInput[] = [{ isPublished: true }];

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

  if (input.category?.trim()) {
    const normalized = input.category.trim().replace(/-/g, "_");
    conditions.push({ category: normalized as Prisma.PlaceWhereInput["category"] });
  }

  if (input.categories?.length) {
    conditions.push({
      OR: input.categories.map((category) => ({
        category: category.replace(/-/g, "_") as Prisma.PlaceWhereInput["category"],
      })),
    });
  }

  if (input.rating != null) {
    conditions.push({ ratingAvg: { gte: input.rating } });
  }

  return conditions;
}

function buildOrderBy(sort: PlaceSort): Prisma.PlaceOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "name":
      return [{ title: "asc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

const placeInclude = {
  destination: {
    select: {
      id: true,
      slug: true,
      title: true,
      country: true,
      region: true,
    },
  },
} satisfies Prisma.PlaceInclude;

export const placesRepository = {
  async list(input: ListPlacesQuery) {
    const where: Prisma.PlaceWhereInput = {
      AND: buildFilterConditions({
        query: input.q,
        destination: input.destination,
        category: input.category,
        rating: input.rating,
      }),
    };

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: placeInclude,
        orderBy: buildOrderBy(input.sort),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.place.count({ where }),
    ]);

    return { places, total, page: input.page, limit: input.limit };
  },

  async search(input: PlaceSearchInput) {
    const page = input.page ?? 1;
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const where: Prisma.PlaceWhereInput = {
      AND: buildFilterConditions({
        query: input.query,
        destination: input.destination,
        categories: input.categories,
        rating: input.rating,
      }),
    };

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: placeInclude,
        orderBy: buildOrderBy(input.sort ?? "recommended"),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.place.count({ where }),
    ]);

    return { places, total, page, limit };
  },

  async listFeatured(limit = 12) {
    return prisma.place.findMany({
      where: { isPublished: true, isFeatured: true },
      include: placeInclude,
      orderBy: [{ reviewCount: "desc" }, { ratingAvg: "desc" }],
      take: limit,
    });
  },

  async findBySlug(slug: string) {
    return prisma.place.findFirst({
      where: { slug, isPublished: true },
      include: { destination: true },
    });
  },

  async findByIdOrSlug(placeIdOrSlug: string) {
    if (isUuid(placeIdOrSlug)) {
      return prisma.place.findFirst({
        where: { id: placeIdOrSlug, isPublished: true },
        include: placeInclude,
      });
    }

    return prisma.place.findFirst({
      where: { slug: placeIdOrSlug, isPublished: true },
      include: placeInclude,
    });
  },
};
