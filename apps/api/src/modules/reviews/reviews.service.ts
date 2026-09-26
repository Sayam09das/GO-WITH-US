import { mapReviewTargetType } from "../../lib/catalog-utils.js";
import { prisma } from "../../lib/db.js";
import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import type { CreateReviewInput, ReportReviewInput, UpdateReviewInput } from "./reviews.schemas.js";

async function assertReviewTargetExists(
  itemType: NonNullable<ReturnType<typeof mapReviewTargetType>>,
  itemId: string,
) {
  switch (itemType) {
    case "destination": {
      const destination = await prisma.destination.findFirst({
        where: { id: itemId, isPublished: true },
        select: { id: true },
      });
      if (!destination) {
        throw new AppError(404, "NOT_FOUND", "Destination not found.");
      }
      return;
    }
    case "stay": {
      const stay = await prisma.stay.findFirst({
        where: { id: itemId, isPublished: true },
        select: { id: true },
      });
      if (!stay) {
        throw new AppError(404, "NOT_FOUND", "Stay not found.");
      }
      return;
    }
    case "experience": {
      const experience = await prisma.experience.findFirst({
        where: { id: itemId, isPublished: true },
        select: { id: true },
      });
      if (!experience) {
        throw new AppError(404, "NOT_FOUND", "Experience not found.");
      }
      return;
    }
    case "restaurant": {
      const restaurant = await prisma.restaurant.findFirst({
        where: { id: itemId, isPublished: true },
        select: { id: true },
      });
      if (!restaurant) {
        throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
      }
      return;
    }
    case "place": {
      const place = await prisma.place.findFirst({
        where: { id: itemId, isPublished: true },
        select: { id: true },
      });
      if (!place) {
        throw new AppError(404, "NOT_FOUND", "Place not found.");
      }
      return;
    }
  }
}

export const reviewsService = {
  async createReview(userId: string, input: CreateReviewInput) {
    const itemType = mapReviewTargetType(input.targetType);
    if (!itemType) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid review target type.");
    }

    await assertReviewTargetExists(itemType, input.targetId);

    const existingReview = await reviewCatalog.findExistingReview(userId, itemType, input.targetId);
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this item.");
    }

    const isEligible = await reviewCatalog.isUserEligibleToReview(userId, itemType, input.targetId);
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this item after booking it or adding it to a trip itinerary.",
      );
    }

    return reviewCatalog.createReview({
      userId,
      itemType,
      itemId: input.targetId,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  },

  async updateReview(userId: string, reviewId: string, input: UpdateReviewInput) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new AppError(404, "NOT_FOUND", "Review not found.");
    }

    if (review.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You can only update your own reviews.");
    }

    const body = input.body ?? input.content;

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(input.rating !== undefined ? { rating: input.rating } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(body !== undefined ? { body } : {}),
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await reviewCatalog.updateReviewAggregates(review.itemType, review.itemId);

    return {
      id: updated.id,
      rating: updated.rating,
      title: updated.title,
      body: updated.body,
      createdAt: updated.createdAt.toISOString(),
      user: {
        id: updated.user.id,
        name: updated.user.fullName,
        avatar: updated.user.avatarUrl,
      },
    };
  },

  async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new AppError(404, "NOT_FOUND", "Review not found.");
    }

    if (review.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You can only delete your own reviews.");
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await reviewCatalog.updateReviewAggregates(review.itemType, review.itemId);
  },

  async reportReview(userId: string, reviewId: string, input: ReportReviewInput) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new AppError(404, "NOT_FOUND", "Review not found.");
    }

    try {
      const report = await prisma.reviewReport.create({
        data: {
          reviewId,
          userId,
          reason: input.reason,
          details: input.details,
        },
      });

      return {
        id: report.id,
        reviewId: report.reviewId,
        reason: report.reason,
        createdAt: report.createdAt.toISOString(),
      };
    } catch (error) {
      if (typeof error === "object" && error != null && "code" in error && error.code === "P2002") {
        throw new AppError(409, "CONFLICT", "You have already reported this review.");
      }

      throw error;
    }
  },
};
