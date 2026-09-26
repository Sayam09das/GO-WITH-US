import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { placesRepository } from "./places.repository.js";
import type { ListPlacesQuery, PlaceSearchInput } from "./places.schemas.js";
import { buildPaginationMeta, toPlaceDetail, toPlaceListItem } from "./places.types.js";

export const placesService = {
  async list(input: ListPlacesQuery) {
    const result = await placesRepository.list(input);

    return {
      places: result.places.map((place) => toPlaceListItem(place)),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async search(input: PlaceSearchInput) {
    const result = await placesRepository.search(input);

    return {
      places: result.places.map((place) => toPlaceListItem(place)),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async listFeatured() {
    const places = await placesRepository.listFeatured();
    return places.map((place) => toPlaceListItem(place));
  },

  async getBySlug(slug: string) {
    const place = await placesRepository.findBySlug(slug);

    if (!place) {
      throw new AppError(404, "NOT_FOUND", "Place not found.");
    }

    return toPlaceDetail(place);
  },

  async listReviews(
    placeIdOrSlug: string,
    options: { page: number; limit: number; rating?: number; sort: "recent" | "rating" },
  ) {
    const place = await placesRepository.findByIdOrSlug(placeIdOrSlug);

    if (!place) {
      throw new AppError(404, "NOT_FOUND", "Place not found.");
    }

    return reviewCatalog.listReviews("place", place.id, options);
  },

  async createReview(
    placeIdOrSlug: string,
    userId: string,
    input: { rating: number; title?: string; body?: string },
  ) {
    const place = await placesRepository.findByIdOrSlug(placeIdOrSlug);

    if (!place) {
      throw new AppError(404, "NOT_FOUND", "Place not found.");
    }

    const existingReview = await reviewCatalog.findExistingReview(userId, "place", place.id);
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this place.");
    }

    const isEligible = await reviewCatalog.isUserEligibleToReview(userId, "place", place.id);
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this place after adding it to a trip itinerary.",
      );
    }

    return reviewCatalog.createReview({
      userId,
      itemType: "place",
      itemId: place.id,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  },
};
