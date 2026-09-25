import { AppError } from "../../lib/errors.js";
import { reviewCatalog } from "../../lib/review-catalog.js";
import { providerFactory } from "../../providers/index.js";
import { mapNormalizedPlaceToAutocomplete } from "../../providers/places/places.mapper.js";
import type { NormalizedPlace } from "../../providers/places/places.types.js";
import {
  filterRestaurantPlaces,
  mapNormalizedPlaceToRestaurantListItem,
  mergeRestaurantSearchResults,
} from "../../providers/restaurants/restaurants.mapper.js";
import { locationService } from "../../services/location/location.service.js";
import { restaurantsRepository } from "./restaurants.repository.js";
import type { ListRestaurantsQuery, RestaurantSearchInput } from "./restaurants.schemas.js";
import {
  buildPaginationMeta,
  type RestaurantListItem,
  toRestaurantDetail,
  toRestaurantListItem,
} from "./restaurants.types.js";

function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

function applyProviderRestaurantFilters(
  items: RestaurantListItem[],
  input: RestaurantSearchInput,
): RestaurantListItem[] {
  return items.filter((item) => {
    if (input.rating != null && item.rating < input.rating) {
      return false;
    }

    if (input.priceLevel?.length && !input.priceLevel.includes(item.priceLevel)) {
      return false;
    }

    if (input.cuisines?.length) {
      const cuisine = item.cuisine.toLowerCase();
      const matches = input.cuisines.some((value) => cuisine.includes(value.toLowerCase()));
      if (!matches) {
        return false;
      }
    }

    return true;
  });
}

async function searchProviderRestaurants(
  input: RestaurantSearchInput,
): Promise<RestaurantListItem[]> {
  const placesProvider = providerFactory.getPlacesProvider();
  if (!placesProvider.isConfigured()) {
    return [];
  }

  let places: NormalizedPlace[] = [];

  if (input.location) {
    const nearby = locationService.normalizeNearbyLocation(input.location);
    places = await placesProvider.searchNearby({
      latitude: nearby.latitude,
      longitude: nearby.longitude,
      radiusMeters: nearby.radiusMeters,
      query: input.query ?? "restaurant",
      limit: input.limit,
    });
  } else {
    const locationQuery = input.destination ?? input.query;
    if (locationQuery) {
      const coordinates = await locationService.resolvePlaceCoordinates({ query: locationQuery });
      if (coordinates) {
        places = await placesProvider.searchNearby({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radiusMeters: 10_000,
          query: input.query ?? "restaurant",
          limit: input.limit,
        });
      } else if (input.query) {
        places = await placesProvider.search({
          query: input.query,
          limit: input.limit,
        });
      }
    }
  }

  return filterRestaurantPlaces(places)
    .map(mapNormalizedPlaceToRestaurantListItem)
    .filter((item) => applyProviderRestaurantFilters([item], input).length > 0);
}

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
    const catalogResult = await restaurantsRepository.search(input);
    const savedIds = userId
      ? await restaurantsRepository.findSavedRestaurantIds(
          userId,
          catalogResult.restaurants.map((restaurant) => restaurant.id),
        )
      : new Set<string>();

    const catalogItems = catalogResult.restaurants.map((restaurant) =>
      toRestaurantListItem(restaurant, savedIds.has(restaurant.id)),
    );

    const placesProvider = providerFactory.getPlacesProvider();
    const useProviderSearch =
      placesProvider.isConfigured() &&
      (Boolean(input.location) || Boolean(input.destination) || Boolean(input.query));

    const providerItems = useProviderSearch ? await searchProviderRestaurants(input) : [];
    const merged = mergeRestaurantSearchResults(catalogItems, providerItems);
    const paginated = paginateItems(merged, input.page, input.limit);

    const placeSuggestions =
      placesProvider.isConfigured() && input.query
        ? (await placesProvider.search({ query: input.query, limit: 6 })).map(
            mapNormalizedPlaceToAutocomplete,
          )
        : [];

    return {
      restaurants: paginated,
      meta: {
        ...buildPaginationMeta({
          page: input.page,
          limit: input.limit,
          total: merged.length,
        }),
        ...(providerItems.length > 0
          ? {
              provider: placesProvider.name,
              providerCount: providerItems.length,
            }
          : {}),
        ...(placeSuggestions.length > 0
          ? {
              placeSuggestions,
            }
          : {}),
      },
    };
  },

  async searchPlaces(input: {
    query: string;
    limit?: number;
    latitude?: number;
    longitude?: number;
  }) {
    const placesProvider = providerFactory.getPlacesProvider();

    if (!placesProvider.isConfigured()) {
      return [];
    }

    if (input.latitude != null && input.longitude != null) {
      return placesProvider.searchNearby({
        latitude: input.latitude,
        longitude: input.longitude,
        query: input.query,
        limit: input.limit ?? 20,
      });
    }

    return placesProvider.search({
      query: input.query,
      limit: input.limit ?? 20,
    });
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
