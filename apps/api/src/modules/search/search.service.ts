import { locationService } from "../../services/location/location.service.js";
import { destinationsService } from "../destinations/destinations.service.js";
import { experiencesService } from "../experiences/experiences.service.js";
import { placesService } from "../places/places.service.js";
import { placeToCatalogPlace } from "../places/places.types.js";
import { restaurantsService } from "../restaurants/restaurants.service.js";
import { staysService } from "../stays/stays.service.js";
import { storiesService } from "../stories/stories.service.js";
import type { GlobalSearchBody, GlobalSearchQuery } from "./search.schemas.js";

export type CatalogPlace = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  image: string | null;
};

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
        places: [] as CatalogPlace[],
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
    const includePlace = type === "all" || type === "place";
    const includeStory = type === "all" || type === "story";

    const [destinations, stays, experiences, restaurants, catalogPlaces, stories] =
      await Promise.all([
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
        includePlace
          ? placesService
              .search({ query: trimmed, page: 1, limit, sort: "recommended" })
              .then((result) => result.places)
              .catch(() => [])
          : Promise.resolve([]),
        includeStory
          ? storiesService
              .search({ query: trimmed, page: 1, limit })
              .then((result) => result.stories)
              .catch(() => [])
          : Promise.resolve([]),
      ]);

    const places = catalogPlaces.map(placeToCatalogPlace);

    return {
      destinations,
      stays,
      experiences,
      restaurants,
      stories,
      places,
      meta: {
        query: trimmed,
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
    const textQuery = body.query?.trim() ?? "";
    const limit = body.limit;
    const types = body.types ?? ["PLACE", "RESTAURANT", "STAY", "EXPERIENCE"];

    const catalogResults =
      textQuery.length > 0
        ? await this.searchByQuery({ q: textQuery, limit, type: "all" }, userId)
        : {
            destinations: [],
            stays: [],
            experiences: [],
            restaurants: [],
            stories: [],
            places: [] as CatalogPlace[],
            meta: { query: "", totals: buildTotals({}) },
          };

    return {
      destinations: types.includes("DESTINATION") ? catalogResults.destinations : [],
      stays: types.includes("STAY") ? catalogResults.stays : [],
      experiences: types.includes("EXPERIENCE") ? catalogResults.experiences : [],
      restaurants: types.includes("RESTAURANT") ? catalogResults.restaurants : [],
      stories: types.includes("STORY") ? catalogResults.stories : [],
      places: types.includes("PLACE") ? catalogResults.places : [],
      meta: {
        query: textQuery,
        location: {
          latitude: nearby.latitude,
          longitude: nearby.longitude,
          radiusMeters: nearby.radiusMeters,
          label: null,
        },
        totals: buildTotals({
          destinations: catalogResults.destinations.length,
          stays: catalogResults.stays.length,
          experiences: catalogResults.experiences.length,
          restaurants: catalogResults.restaurants.length,
          stories: catalogResults.stories.length,
          places: types.includes("PLACE") ? catalogResults.places.length : 0,
        }),
      },
    };
  },
};
