import { ProviderUnavailableError } from "../../lib/provider-errors.js";
import { providerFactory } from "../../providers/index.js";
import { mapNormalizedPlaceToPublicPlace } from "../../providers/places/places.mapper.js";
import type { NormalizedPlace } from "../../providers/places/places.types.js";
import { locationService } from "../../services/location/location.service.js";
import { destinationsService } from "../destinations/destinations.service.js";
import { experiencesService } from "../experiences/experiences.service.js";
import { restaurantsService } from "../restaurants/restaurants.service.js";
import { staysService } from "../stays/stays.service.js";
import { storiesService } from "../stories/stories.service.js";
import type { GlobalSearchBody, GlobalSearchQuery } from "./search.schemas.js";

type SearchTotals = {
  destinations: number;
  stays: number;
  experiences: number;
  restaurants: number;
  stories: number;
  places: number;
};

function buildTotals(partial: Partial<SearchTotals>): SearchTotals {
  return {
    destinations: partial.destinations ?? 0,
    stays: partial.stays ?? 0,
    experiences: partial.experiences ?? 0,
    restaurants: partial.restaurants ?? 0,
    stories: partial.stories ?? 0,
    places: partial.places ?? 0,
  };
}

export const searchService = {
  async searchByQuery(query: GlobalSearchQuery, userId?: string) {
    const trimmed = query.q?.trim() ?? "";
    const limit = query.limit;
    const type = query.type ?? "all";

    if (!trimmed) {
      return {
        destinations: [],
        stays: [],
        experiences: [],
        restaurants: [],
        stories: [],
        places: [],
        meta: {
          query: "",
          totals: buildTotals({}),
        },
      };
    }

    const includeDestination = type === "all" || type === "destination";
    const includeStay = type === "all" || type === "stay";
    const includeExperience = type === "all" || type === "experience";
    const includeRestaurant = type === "all" || type === "restaurant";
    const includeStory = type === "all" || type === "story";

    const [destinations, stays, experiences, restaurants, stories, places] = await Promise.all([
      includeDestination
        ? destinationsService
            .search({ query: trimmed, page: 1, limit, sort: "popular" }, userId)
            .then((result) => result.destinations)
            .catch(() => [])
        : Promise.resolve([]),
      includeStay
        ? staysService
            .search({ query: trimmed, page: 1, limit, sort: "recommended", rooms: 1 }, userId)
            .then((result) => result.stays)
            .catch(() => [])
        : Promise.resolve([]),
      includeExperience
        ? experiencesService
            .search({ query: trimmed, page: 1, limit, sort: "popular" }, userId)
            .then((result) => result.experiences)
            .catch(() => [])
        : Promise.resolve([]),
      includeRestaurant
        ? restaurantsService
            .search({ query: trimmed, page: 1, limit, sort: "recommended" }, userId)
            .then((result) => result.restaurants)
            .catch(() => [])
        : Promise.resolve([]),
      includeStory
        ? storiesService
            .search({ query: trimmed, page: 1, limit })
            .then((result) => result.stories)
            .catch(() => [])
        : Promise.resolve([]),
      (async () => {
        const placesProvider = providerFactory.getPlacesProvider();
        if (!placesProvider.isConfigured()) {
          return [] as NormalizedPlace[];
        }

        try {
          return await placesProvider.search({ query: trimmed, limit });
        } catch (error) {
          if (error instanceof ProviderUnavailableError) {
            return [];
          }
          throw error;
        }
      })(),
    ]);

    return {
      destinations,
      stays,
      experiences,
      restaurants,
      stories,
      places: places.map(mapNormalizedPlaceToPublicPlace),
      meta: {
        query: trimmed,
        provider: providerFactory.getPlacesProvider().isConfigured()
          ? providerFactory.getPlacesProvider().name
          : undefined,
        totals: buildTotals({
          destinations: destinations.length,
          stays: stays.length,
          experiences: experiences.length,
          restaurants: restaurants.length,
          stories: stories.length,
          places: places.length,
        }),
      },
    };
  },

  async searchWithLocation(body: GlobalSearchBody, userId?: string) {
    if (!body.location) {
      return this.searchByQuery(
        {
          q: body.query,
          limit: body.limit,
          type: "all",
        },
        userId,
      );
    }

    const nearby = locationService.normalizeNearbyLocation(body.location);
    const resolvedLocation = await locationService.reverseGeocode(
      nearby.latitude,
      nearby.longitude,
    );
    const types = body.types ?? ["PLACE", "RESTAURANT", "STAY", "EXPERIENCE"];
    const query = body.query?.trim() ?? "restaurants";
    const limit = body.limit;

    let places: NormalizedPlace[] = [];

    if (types.includes("PLACE") || types.includes("RESTAURANT")) {
      try {
        places = await restaurantsService.searchPlaces({
          query,
          limit,
          latitude: nearby.latitude,
          longitude: nearby.longitude,
        });
      } catch (error) {
        if (error instanceof ProviderUnavailableError && types.length === 1) {
          throw error;
        }
      }
    }

    const textQuery = body.query?.trim() || resolvedLocation?.city || resolvedLocation?.label || "";
    const catalogResults =
      textQuery.length > 0
        ? await this.searchByQuery({ q: textQuery, limit, type: "all" }, userId)
        : {
            destinations: [],
            stays: [],
            experiences: [],
            restaurants: [],
            stories: [],
            places: [] as NormalizedPlace[],
            meta: { query: "", totals: buildTotals({}) },
          };

    return {
      destinations: types.includes("DESTINATION") ? catalogResults.destinations : [],
      stays: types.includes("STAY") ? catalogResults.stays : [],
      experiences: types.includes("EXPERIENCE") ? catalogResults.experiences : [],
      restaurants: types.includes("RESTAURANT") ? catalogResults.restaurants : [],
      stories: types.includes("STORY") ? catalogResults.stories : [],
      places: places.map(mapNormalizedPlaceToPublicPlace),
      meta: {
        query: textQuery,
        location: {
          latitude: nearby.latitude,
          longitude: nearby.longitude,
          radiusMeters: nearby.radiusMeters,
          label: locationService.formatLocationLabel(resolvedLocation),
        },
        provider: providerFactory.getPlacesProvider().isConfigured()
          ? providerFactory.getPlacesProvider().name
          : undefined,
        totals: buildTotals({
          destinations: catalogResults.destinations.length,
          stays: catalogResults.stays.length,
          experiences: catalogResults.experiences.length,
          restaurants: catalogResults.restaurants.length,
          stories: catalogResults.stories.length,
          places: places.length,
        }),
      },
    };
  },
};
