import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { restaurantsRepository } from "./restaurants.repository.js";
import type { ListRestaurantsQuery, RestaurantSearchInput } from "./restaurants.schemas.js";
import {
  buildPaginationMeta,
  toRestaurantDetail,
  toRestaurantListItem,
} from "./restaurants.types.js";

export const restaurantsService = {
  async list(input: ListRestaurantsQuery, userId?: string) {
    const result = await restaurantsRepository.list(input);
    const savedIds = userId
      ? await restaurantsRepository.findSavedRestaurantIds(
          userId,
          result.restaurants.map((restaurant) => restaurant.id),
        )
      : new Set<string>();

    return {
      restaurants: result.restaurants.map((restaurant) =>
        toRestaurantListItem(restaurant, savedIds.has(restaurant.id)),
      ),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async search(input: RestaurantSearchInput, userId?: string) {
    const result = await restaurantsRepository.search(input);
    const savedIds = userId
      ? await restaurantsRepository.findSavedRestaurantIds(
          userId,
          result.restaurants.map((restaurant) => restaurant.id),
        )
      : new Set<string>();

    return {
      restaurants: result.restaurants.map((restaurant) =>
        toRestaurantListItem(restaurant, savedIds.has(restaurant.id)),
      ),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async listFeatured(userId?: string) {
    const restaurants = await restaurantsRepository.listFeatured();
    const savedIds = userId
      ? await restaurantsRepository.findSavedRestaurantIds(
          userId,
          restaurants.map((restaurant) => restaurant.id),
        )
      : new Set<string>();

    return restaurants.map((restaurant) =>
      toRestaurantListItem(restaurant, savedIds.has(restaurant.id)),
    );
  },

  async getBySlug(slug: string, userId?: string) {
    const restaurant = await restaurantsRepository.findBySlug(slug);

    if (!restaurant) {
      throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
    }

    const savedIds = userId
      ? await restaurantsRepository.findSavedRestaurantIds(userId, [restaurant.id])
      : new Set<string>();

    return toRestaurantDetail(restaurant, savedIds.has(restaurant.id));
  },

  async listReviews(
    restaurantIdOrSlug: string,
    options: { page: number; limit: number; rating?: number; sort: "recent" | "rating" },
  ) {
    const restaurant = await restaurantsRepository.findByIdOrSlug(restaurantIdOrSlug);

    if (!restaurant) {
      throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
    }

    return reviewCatalog.listReviews("restaurant", restaurant.id, options);
  },

  async createReview(
    restaurantIdOrSlug: string,
    userId: string,
    input: { rating: number; title?: string; body?: string },
  ) {
    const restaurant = await restaurantsRepository.findByIdOrSlug(restaurantIdOrSlug);

    if (!restaurant) {
      throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
    }

    const existingReview = await reviewCatalog.findExistingReview(
      userId,
      "restaurant",
      restaurant.id,
    );
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this restaurant.");
    }

    const isEligible = await reviewCatalog.isUserEligibleToReview(
      userId,
      "restaurant",
      restaurant.id,
    );
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this restaurant after adding it to a trip itinerary.",
      );
    }

    return reviewCatalog.createReview({
      userId,
      itemType: "restaurant",
      itemId: restaurant.id,
      rating: input.rating,
      title: input.title,
      body: input.body,
    });
  },
};
