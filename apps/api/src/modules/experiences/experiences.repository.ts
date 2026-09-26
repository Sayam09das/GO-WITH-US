import type { ExperienceCategory, Prisma } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import type {
  ExperienceCategoryInput,
  ExperienceListSort,
  ExperienceSearchInput,
  ExperienceSearchSort,
  ListExperiencesQuery,
} from "./experiences.schemas.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const HALF_DAY_MAX_MINUTES = 240;
const FULL_DAY_MAX_MINUTES = 480;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function mapCategory(value: ExperienceCategoryInput): ExperienceCategory {
  return value.replace(/-/g, "_") as ExperienceCategory;
}

function mapCategories(values: ExperienceCategoryInput[]): ExperienceCategory[] {
  return values.map(mapCategory);
}

function buildDurationBucketFilter(
  bucket: ListExperiencesQuery["duration"],
): Prisma.ExperienceWhereInput | undefined {
  if (!bucket) {
    return undefined;
  }

  switch (bucket) {
    case "half-day":
      return { durationMinutes: { lte: HALF_DAY_MAX_MINUTES } };
    case "full-day":
      return {
        durationMinutes: {
          gt: HALF_DAY_MAX_MINUTES,
          lte: FULL_DAY_MAX_MINUTES,
        },
      };
    case "multi-day":
      return { durationMinutes: { gt: FULL_DAY_MAX_MINUTES } };
  }
}

function buildDurationRangeFilter(input?: {
  min?: number;
  max?: number;
}): Prisma.ExperienceWhereInput | undefined {
  if (!input) {
    return undefined;
  }

  const minMinutes = input.min != null ? Math.round(input.min * 60) : undefined;
  const maxMinutes = input.max != null ? Math.round(input.max * 60) : undefined;

  if (minMinutes == null && maxMinutes == null) {
    return undefined;
  }

  if (minMinutes != null && maxMinutes != null) {
    return { durationMinutes: { gte: minMinutes, lte: maxMinutes } };
  }

  if (minMinutes != null) {
    return { durationMinutes: { gte: minMinutes } };
  }

  return { durationMinutes: { lte: maxMinutes } };
}

function buildFilterConditions(input: {
  query?: string;
  destination?: string;
  category?: ExperienceCategoryInput;
  categories?: ExperienceCategoryInput[];
  budgetTier?: ListExperiencesQuery["budgetTier"];
  durationBucket?: ListExperiencesQuery["duration"];
  durationRange?: { min?: number; max?: number };
  rating?: number;
  priceRange?: { min?: number; max?: number };
}): Prisma.ExperienceWhereInput[] {
  const conditions: Prisma.ExperienceWhereInput[] = [{ isPublished: true }];

  if (input.query?.trim()) {
    const query = input.query.trim();
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { overview: { contains: query, mode: "insensitive" } },
        { meetingPoint: { contains: query, mode: "insensitive" } },
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

  if (input.category) {
    conditions.push({ category: mapCategory(input.category) });
  }

  if (input.categories?.length) {
    conditions.push({ category: { in: mapCategories(input.categories) } });
  }

  if (input.budgetTier) {
    conditions.push({ priceTier: input.budgetTier });
  }

  const durationBucket = buildDurationBucketFilter(input.durationBucket);
  if (durationBucket) {
    conditions.push(durationBucket);
  }

  const durationRange = buildDurationRangeFilter(input.durationRange);
  if (durationRange) {
    conditions.push(durationRange);
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
            estimatedPriceFrom:
              min != null && max != null
                ? { gte: min, lte: max }
                : min != null
                  ? { gte: min }
                  : { lte: max },
          },
          ...(min != null && min <= 75
            ? [{ priceTier: "budget" as const, estimatedPriceFrom: null }]
            : []),
          ...(min != null && min <= 150 && (max == null || max >= 75)
            ? [{ priceTier: "moderate" as const, estimatedPriceFrom: null }]
            : []),
          ...(max == null || max >= 150
            ? [{ priceTier: "luxury" as const, estimatedPriceFrom: null }]
            : []),
        ],
      });
    }
  }

  return conditions;
}

function buildListOrderBy(sort: ExperienceListSort): Prisma.ExperienceOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "duration":
      return [{ durationMinutes: "asc" }, { title: "asc" }];
    case "price":
      return [{ estimatedPriceFrom: "asc" }, { priceTier: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

function buildSearchOrderBy(
  sort: ExperienceSearchSort,
): Prisma.ExperienceOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ ratingAvg: "desc" }, { reviewCount: "desc" }];
    case "price":
      return [{ estimatedPriceFrom: "asc" }, { priceTier: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { reviewCount: "desc" }, { ratingAvg: "desc" }];
  }
}

const experienceInclude = {
  destination: {
    select: {
      id: true,
      slug: true,
      title: true,
      country: true,
      region: true,
    },
  },
} satisfies Prisma.ExperienceInclude;

export const experiencesRepository = {
  async list(input: ListExperiencesQuery) {
    const where: Prisma.ExperienceWhereInput = {
      AND: buildFilterConditions(input),
    };

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        include: experienceInclude,
        orderBy: buildListOrderBy(input.sort),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.experience.count({ where }),
    ]);

    return { experiences, total, page: input.page, limit: input.limit };
  },

  async search(input: ExperienceSearchInput) {
    const page = input.page ?? 1;
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const where: Prisma.ExperienceWhereInput = {
      AND: buildFilterConditions({
        query: input.query,
        destination: input.destination,
        categories: input.categories,
        rating: input.rating,
        priceRange: input.priceRange,
        durationRange: input.duration,
      }),
    };

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        include: experienceInclude,
        orderBy: buildSearchOrderBy(input.sort ?? "popular"),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.experience.count({ where }),
    ]);

    return { experiences, total, page, limit };
  },

  async listFeatured(limit = 8) {
    return prisma.experience.findMany({
      where: { isPublished: true, isFeatured: true },
      include: experienceInclude,
      orderBy: [{ reviewCount: "desc" }, { ratingAvg: "desc" }],
      take: limit,
    });
  },

  async findBySlug(slug: string) {
    return prisma.experience.findFirst({
      where: { slug, isPublished: true },
      include: {
        destination: true,
      },
    });
  },

  async findByIdOrSlug(experienceIdOrSlug: string) {
    if (isUuid(experienceIdOrSlug)) {
      return prisma.experience.findFirst({
        where: { id: experienceIdOrSlug, isPublished: true },
        include: experienceInclude,
      });
    }

    return prisma.experience.findFirst({
      where: { slug: experienceIdOrSlug, isPublished: true },
      include: experienceInclude,
    });
  },

  async findSavedExperienceIds(userId: string, experienceIds: string[]) {
    if (experienceIds.length === 0) {
      return new Set<string>();
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId,
        itemType: "experience",
        itemId: { in: experienceIds },
      },
      select: { itemId: true },
    });

    return new Set(savedItems.map((item) => item.itemId));
  },
};
