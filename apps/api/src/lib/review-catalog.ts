import type { ItemType, Prisma } from "../generated/client.js";
import { buildRatingDistribution } from "./catalog-utils.js";
import { prisma } from "./db.js";

export type ReviewListOptions = {
  page: number;
  limit: number;
  rating?: number;
  sort?: "recent" | "rating";
};

export type CreateReviewInput = {
  userId: string;
  itemType: ItemType;
  itemId: string;
  rating: number;
  title?: string;
  body?: string;
};

export type ReviewSummary = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

function toReviewSummary(review: {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  user: { id: string; fullName: string; avatarUrl: string | null };
}): ReviewSummary {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title,
    body: review.body,
    createdAt: review.createdAt.toISOString(),
    user: {
      id: review.user.id,
      name: review.user.fullName,
      avatar: review.user.avatarUrl,
    },
  };
}

async function updateCatalogReviewAggregates(
  itemType: ItemType,
  itemId: string,
  tx: Prisma.TransactionClient,
) {
  const where = { itemType, itemId, status: "published" as const };
  const aggregate = await tx.review.aggregate({
    where,
    _avg: { rating: true },
    _count: { rating: true },
  });

  const data = {
    ratingAvg: aggregate._avg.rating,
    reviewCount: aggregate._count.rating,
  };

  switch (itemType) {
    case "destination":
      await tx.destination.update({ where: { id: itemId }, data });
      break;
    case "stay":
      await tx.stay.update({ where: { id: itemId }, data });
      break;
    case "experience":
      await tx.experience.update({ where: { id: itemId }, data });
      break;
    case "restaurant":
      await tx.restaurant.update({ where: { id: itemId }, data });
      break;
  }
}

export const reviewCatalog = {
  async listReviews(itemType: ItemType, itemId: string, options: ReviewListOptions) {
    const where = {
      itemType,
      itemId,
      status: "published" as const,
      ...(options.rating ? { rating: options.rating } : {}),
    };

    const orderBy =
      options.sort === "rating"
        ? [{ rating: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const [reviews, total, aggregate, grouped] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { itemType, itemId, status: "published" },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { itemType, itemId, status: "published" },
        _count: { rating: true },
      }),
    ]);

    const distribution = buildRatingDistribution(
      Object.fromEntries(grouped.map((entry) => [entry.rating, entry._count.rating])),
    );

    return {
      reviews: reviews.map(toReviewSummary),
      aggregate: {
        averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating) : 0,
        reviewCount: aggregate._count.rating,
        ratingDistribution: distribution,
      },
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / options.limit)),
      },
    };
  },

  async createReview(input: CreateReviewInput) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          userId: input.userId,
          itemType: input.itemType,
          itemId: input.itemId,
          rating: input.rating,
          title: input.title,
          body: input.body,
          status: "published",
        },
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      });

      await updateCatalogReviewAggregates(input.itemType, input.itemId, tx);
      return toReviewSummary(review);
    });
  },

  async updateReviewAggregates(itemType: ItemType, itemId: string) {
    return prisma.$transaction(async (tx) => updateCatalogReviewAggregates(itemType, itemId, tx));
  },

  async findExistingReview(userId: string, itemType: ItemType, itemId: string) {
    return prisma.review.findUnique({
      where: {
        userId_itemType_itemId: { userId, itemType, itemId },
      },
    });
  },

  async isUserEligibleToReview(userId: string, itemType: ItemType, itemId: string) {
    const bookingItem = await prisma.bookingItem.findFirst({
      where: {
        ...(itemType === "stay" ? { stayId: itemId } : {}),
        ...(itemType === "experience" ? { experienceId: itemId } : {}),
        booking: {
          userId,
          status: "completed",
        },
      },
      select: { id: true },
    });

    if (bookingItem) {
      return true;
    }

    const itineraryItem = await prisma.itineraryItem.findFirst({
      where: {
        itemType: itemType === "restaurant" ? "restaurant" : itemType,
        itemId,
        trip: { userId },
      },
      select: { id: true },
    });

    return Boolean(itineraryItem);
  },
};
