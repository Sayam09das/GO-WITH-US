import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { destinationsRepository } from "./destinations.repository.js";
import type { DestinationSearchInput } from "./destinations.schemas.js";
import {
  buildPaginationMeta,
  toDestinationDetail,
  toDestinationListItem,
} from "./destinations.types.js";

export const destinationsService = {
  async list(input: {
    page: number;
    limit: number;
    featured?: boolean;
    sort: DestinationSearchInput["sort"];
    userId?: string;
  }) {
    const result = await destinationsRepository.list(input);
    const savedIds = input.userId
      ? await destinationsRepository.findSavedDestinationIds(
          input.userId,
          result.destinations.map((destination) => destination.id),
        )
      : new Set<string>();

    return {
      destinations: result.destinations.map((destination) =>
        toDestinationListItem(destination, savedIds.has(destination.id)),
      ),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total: result.total,
      }),
    };
  },

  async search(input: DestinationSearchInput, userId?: string) {
    const result = await destinationsRepository.search(input);
    const savedIds = userId
      ? await destinationsRepository.findSavedDestinationIds(
          userId,
          result.destinations.map((destination) => destination.id),
        )
      : new Set<string>();

    return {
      destinations: result.destinations.map((destination) =>
        toDestinationListItem(destination, savedIds.has(destination.id)),
      ),
      meta: {
        ...buildPaginationMeta({
          page: result.page,
          limit: result.limit,
          total: result.total,
        }),
        ...(input.duration ? { durationFilterApplied: false } : {}),
      },
    };
  },

  async listFeatured(userId?: string) {
    const destinations = await destinationsRepository.listFeatured();
    const savedIds = userId
      ? await destinationsRepository.findSavedDestinationIds(
          userId,
          destinations.map((destination) => destination.id),
        )
      : new Set<string>();

    return destinations.map((destination) =>
      toDestinationListItem(destination, savedIds.has(destination.id)),
    );
  },

  async listCategories() {
    return destinationsRepository.listCategories();
  },

  async getBySlug(slug: string, userId?: string) {
    const destination = await destinationsRepository.findBySlug(slug);

    if (!destination) {
      throw new AppError(404, "NOT_FOUND", "Destination not found.");
    }

    const relatedDestinations = await destinationsRepository.findRelated(destination);
    const savedIds = userId
      ? await destinationsRepository.findSavedDestinationIds(userId, [
          destination.id,
          ...relatedDestinations.map((item) => item.id),
        ])
      : new Set<string>();

    const detail = toDestinationDetail({
      destination,
      relatedDestinations,
      isSaved: savedIds.has(destination.id),
    });

    return {
      ...detail,
      relatedDestinations: detail.relatedDestinations.map((item) => ({
        ...item,
        isSaved: savedIds.has(item.id),
      })),
    };
  },

  async listReviews(
    destinationIdOrSlug: string,
    query: { page: number; limit: number; rating?: number; sort: "recent" | "rating" },
  ) {
    const destination = await destinationsRepository.findByIdOrSlug(destinationIdOrSlug);

    if (!destination) {
      throw new AppError(404, "NOT_FOUND", "Destination not found.");
    }

    return reviewCatalog.listReviews("destination", destination.id, query);
  },
};
