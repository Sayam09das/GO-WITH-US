import type { Prisma, StoryCategory } from "@prisma/client";
import { prisma } from "../../lib/db.js";
import type { StorySearchInput } from "./stories.schemas.js";

function buildPublishedWhere(input?: {
  category?: StoryCategory;
  featured?: boolean;
  query?: string;
}): Prisma.StoryWhereInput {
  const conditions: Prisma.StoryWhereInput[] = [{ status: "published" }];

  if (input?.category) {
    conditions.push({ category: input.category });
  }

  if (input?.featured !== undefined) {
    conditions.push({ isFeatured: input.featured });
  }

  if (input?.query?.trim()) {
    const query = input.query.trim();
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { authorName: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  return { AND: conditions };
}

export const storiesRepository = {
  list(input: { page: number; limit: number; category?: StoryCategory; featured?: boolean }) {
    const where = buildPublishedWhere(input);

    return Promise.all([
      prisma.story.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.story.count({ where }),
    ]);
  },

  listFeatured(limit = 6) {
    return prisma.story.findMany({
      where: buildPublishedWhere({ featured: true }),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  },

  search(input: StorySearchInput) {
    const where = buildPublishedWhere({
      category: input.category,
      featured: input.featured,
      query: input.query,
    });

    return Promise.all([
      prisma.story.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.story.count({ where }),
    ]);
  },

  findBySlug(slug: string) {
    return prisma.story.findFirst({
      where: {
        slug,
        status: "published",
      },
    });
  },
};
