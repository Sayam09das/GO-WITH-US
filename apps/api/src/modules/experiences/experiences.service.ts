import { CACHE_KEYS, CACHE_TTL } from "../../infrastructure/cache/cache.keys.js";
import { cacheService } from "../../infrastructure/cache/cache.service.js";
import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { mapExperienceAvailabilityToResult } from "../../providers/experiences/experiences.mapper.js";
import { providerFactory } from "../../providers/index.js";
import { experiencesRepository } from "./experiences.repository.js";
import type { ExperienceSearchInput, ListExperiencesQuery } from "./experiences.schemas.js";
import {
  buildPaginationMeta,
  toExperienceDetail,
  toExperienceListItem,
} from "./experiences.types.js";

export const experiencesService = {
  async list(input: ListExperiencesQuery, userId?: string) {
    const result = await experiencesRepository.list(input);
    const savedIds = userId
      ? await experiencesRepository.findSavedExperienceIds(
          userId,
          result.experiences.map((experience) => experience.id),
        )
      : new Set<string>();

    return {
      experiences: result.experiences.map((experience) =>
        toExperienceListItem(experience, savedIds.has(experience.id)),
      ),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async search(input: ExperienceSearchInput, userId?: string) {
    const result = await experiencesRepository.search(input);
    const savedIds = userId
      ? await experiencesRepository.findSavedExperienceIds(
          userId,
          result.experiences.map((experience) => experience.id),
        )
      : new Set<string>();

    return {
      experiences: result.experiences.map((experience) =>
        toExperienceListItem(experience, savedIds.has(experience.id)),
      ),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async listFeatured(userId?: string) {
    const experiences = await cacheService.getOrSet(
      CACHE_KEYS.experiencesFeatured,
      CACHE_TTL.featured,
      () => experiencesRepository.listFeatured(),
    );
    const savedIds = userId
      ? await experiencesRepository.findSavedExperienceIds(
          userId,
          experiences.map((experience) => experience.id),
        )
      : new Set<string>();

    return experiences.map((experience) =>
      toExperienceListItem(experience, savedIds.has(experience.id)),
    );
  },

  async getBySlug(slug: string, userId?: string) {
    const experience = await experiencesRepository.findBySlug(slug);

    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    const savedIds = userId
      ? await experiencesRepository.findSavedExperienceIds(userId, [experience.id])
      : new Set<string>();

    return toExperienceDetail(experience, savedIds.has(experience.id));
  },

  async listReviews(
    experienceIdOrSlug: string,
    input: { page: number; limit: number; rating?: number; sort: "recent" | "rating" },
  ) {
    const experience = await experiencesRepository.findByIdOrSlug(experienceIdOrSlug);

    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    return reviewCatalog.listReviews("experience", experience.id, {
      page: input.page,
      limit: input.limit,
      rating: input.rating,
      sort: input.sort,
    });
  },

  async createReview(
    experienceIdOrSlug: string,
    userId: string,
    input: { rating: number; title?: string; body?: string },
  ) {
    const experience = await experiencesRepository.findByIdOrSlug(experienceIdOrSlug);

    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    const existingReview = await reviewCatalog.findExistingReview(
      userId,
      "experience",
      experience.id,
    );
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this experience.");
    }

    const isEligible = await reviewCatalog.isUserEligibleToReview(
      userId,
      "experience",
      experience.id,
    );
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this experience after adding it to a trip itinerary or completing an experience booking.",
      );
    }

    return reviewCatalog.createReview({
      userId,
      itemType: "experience",
      itemId: experience.id,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  },

  async getAvailability(
    experienceIdOrSlug: string,
    input: { date: string; startTime?: string; guests: { adults: number; children: number } },
  ) {
    const experience = await experiencesRepository.findByIdOrSlug(experienceIdOrSlug);

    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    const experienceProvider = providerFactory.getExperienceProvider();
    if (experienceProvider.isConfigured()) {
      const providerAvailability = await experienceProvider.searchAvailability({
        experienceId: experience.id,
        sourceId: experience.slug,
        date: input.date,
        startTime: input.startTime,
        guests: input.guests,
      });

      if (providerAvailability) {
        return mapExperienceAvailabilityToResult(providerAvailability);
      }
    }

    const totalGuests = input.guests.adults + input.guests.children;
    const maxGuests = 12;

    return {
      experienceId: experience.id,
      date: input.date,
      startTime: input.startTime ?? "09:00",
      guests: input.guests,
      isAvailable: totalGuests <= maxGuests,
      options: [
        {
          id: `${experience.id}-standard`,
          label: experience.durationLabel ?? "Standard session",
          startTime: input.startTime ?? "09:00",
          maxGuests,
          priceFrom: experience.estimatedPriceFrom,
          available: totalGuests <= maxGuests,
        },
      ],
      meta: {
        inventoryModel: "guidance" as const,
      },
    };
  },
};
