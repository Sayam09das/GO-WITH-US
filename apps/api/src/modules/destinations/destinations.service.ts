import { CACHE_KEYS, CACHE_TTL } from "../../infrastructure/cache/cache.keys.js";
import { cacheService } from "../../infrastructure/cache/cache.service.js";
import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { providerFactory } from "../../providers/index.js";
import { destinationsRepository } from "./destinations.repository.js";
import type { DestinationSearchInput } from "./destinations.schemas.js";
import {
  buildPaginationMeta,
  toDestinationDetail,
  toDestinationListItem,
} from "./destinations.types.js";

function normalizeSuggestionQuery(query: string): string {
  return query.trim().toLowerCase().slice(0, 64);
}

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
    const suggestionQuery = input.query ? normalizeSuggestionQuery(input.query) : "";
    const cacheKey =
      suggestionQuery.length > 0 && suggestionQuery.length <= 32
        ? CACHE_KEYS.searchSuggestions(suggestionQuery)
        : CACHE_KEYS.destinationSearch(cacheService.hashQuery(input));

    const result = await cacheService.getOrSet(cacheKey, CACHE_TTL.searchResults, () =>
      destinationsRepository.search(input),
    );

    const savedIds = userId
      ? await destinationsRepository.findSavedDestinationIds(
          userId,
          result.destinations.map((destination) => destination.id),
        )
      : new Set<string>();

    const placesProvider = providerFactory.getPlacesProvider();
    const placeSuggestions =
      placesProvider.isConfigured() && suggestionQuery.length > 0
        ? await placesProvider.autocomplete({ query: suggestionQuery, limit: 6 })
        : [];

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
        ...(placeSuggestions.length > 0
          ? {
              placeSuggestions,
              provider: placesProvider.name,
            }
          : {}),
      },
    };
  },

  async listFeatured(userId?: string) {
    const destinations = await cacheService.getOrSet(
      CACHE_KEYS.destinationsFeatured,
      CACHE_TTL.featured,
      () => destinationsRepository.listFeatured(),
    );

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
    const cached = await cacheService.getOrSet(
      CACHE_KEYS.destination(slug),
      CACHE_TTL.destinationDetail,
      async () => {
        const destination = await destinationsRepository.findBySlug(slug);
        if (!destination) {
          return null;
        }

        const relatedDestinations = await destinationsRepository.findRelated(destination);
        return { destination, relatedDestinations };
      },
    );

    if (!cached) {
      throw new AppError(404, "NOT_FOUND", "Destination not found.");
    }

    const savedIds = userId
      ? await destinationsRepository.findSavedDestinationIds(userId, [
          cached.destination.id,
          ...cached.relatedDestinations.map((item) => item.id),
        ])
      : new Set<string>();

    const detail = toDestinationDetail({
      destination: cached.destination,
      relatedDestinations: cached.relatedDestinations,
      isSaved: savedIds.has(cached.destination.id),
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
