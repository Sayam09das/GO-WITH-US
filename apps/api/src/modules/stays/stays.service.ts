import type { z } from "zod";
import { AppError } from "../../lib/errors.js";
import { staysRepository } from "./stays.repository.js";
import type { ListStaysQuery, StaySearchInput, stayAvailabilitySchema } from "./stays.schemas.js";
import {
  buildPaginationMeta,
  buildStayAvailability,
  type StayReviewSummary,
  toStayDetail,
  toStayListItem,
} from "./stays.types.js";

type StayAvailabilityInput = z.infer<typeof stayAvailabilitySchema>;

function toReviewSummary(review: {
  id: string;
  rating: number;
  body: string | null;
  createdAt: Date;
  user: { id: string; fullName: string; avatarUrl: string | null };
}): StayReviewSummary {
  return {
    id: review.id,
    rating: review.rating,
    body: review.body,
    createdAt: review.createdAt.toISOString(),
    user: {
      id: review.user.id,
      name: review.user.fullName,
      avatar: review.user.avatarUrl,
    },
  };
}

export const staysService = {
  async list(input: ListStaysQuery, userId?: string) {
    const result = await staysRepository.list(input);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(
          userId,
          result.stays.map((stay) => stay.id),
        )
      : new Set<string>();

    return {
      stays: result.stays.map((stay) => toStayListItem(stay, savedIds.has(stay.id))),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async search(input: StaySearchInput, userId?: string) {
    const result = await staysRepository.search(input);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(
          userId,
          result.stays.map((stay) => stay.id),
        )
      : new Set<string>();

    return {
      stays: result.stays.map((stay) => toStayListItem(stay, savedIds.has(stay.id))),
      meta: {
        ...buildPaginationMeta({
          page: result.page,
          limit: result.limit,
          total: result.total,
        }),
        ...(input.checkIn || input.checkOut ? { dateFilterApplied: false } : {}),
        ...(input.guests ? { guestFilterApplied: false } : {}),
      },
    };
  },

  async getBySlug(slug: string, userId?: string) {
    const stay = await staysRepository.findBySlug(slug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const nearbyExperiences = await staysRepository.findNearbyExperiences(stay.destinationId);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(userId, [stay.id])
      : new Set<string>();

    return toStayDetail(stay, nearbyExperiences, savedIds.has(stay.id));
  },

  async getAvailability(stayIdOrSlug: string, input: StayAvailabilityInput) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    return buildStayAvailability({
      stay,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
    });
  },

  async listReviews(stayIdOrSlug: string, page: number, limit: number) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const result = await staysRepository.listReviews(stay.id, page, limit);

    return {
      reviews: result.reviews.map(toReviewSummary),
      aggregate: {
        average: result.aggregate._avg.rating ? Number(result.aggregate._avg.rating) : 0,
        count: result.aggregate._count.rating,
      },
      meta: buildPaginationMeta({ page, limit, total: result.total }),
    };
  },

  async createReview(
    stayIdOrSlug: string,
    userId: string,
    input: { rating: number; body?: string },
  ) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const existingReview = await staysRepository.findExistingReview(userId, stay.id);
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this stay.");
    }

    const isEligible = await staysRepository.isUserEligibleToReviewStay(userId, stay.id);
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this stay after adding it to a trip itinerary or completing a stay booking.",
      );
    }

    const review = await staysRepository.createReview({
      userId,
      stayId: stay.id,
      rating: input.rating,
      body: input.body,
    });

    return toReviewSummary(review);
  },
};
