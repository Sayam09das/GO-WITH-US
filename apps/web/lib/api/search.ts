import type {
  DestinationListItem as ApiDestinationListItem,
  ExperienceListItem as ApiExperienceListItem,
  RestaurantListItem as ApiRestaurantListItem,
  StayListItem as ApiStayListItem,
  StoryListItem as ApiStoryListItem,
} from "@gowithus/types";
import type { DestinationListItem } from "@/types/destination";
import type { ExperienceListItem } from "@/types/experience";
import type { JournalStory } from "@/types/journal";
import type { RestaurantListItem } from "@/types/restaurant";
import type { StayListItem } from "@/types/stay";
import { apiFetch } from "./client";
import {
  mapDestinationListItem,
  mapExperienceListItem,
  mapJournalStory,
  mapRestaurantListItem,
  mapStayListItem,
} from "./mappers";

export type GlobalSearchResults = {
  destinations: DestinationListItem[];
  stays: StayListItem[];
  experiences: ExperienceListItem[];
  stories: JournalStory[];
};

export async function searchGlobal(query: string, limit = 6): Promise<GlobalSearchResults> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { destinations: [], stays: [], experiences: [], stories: [] };
  }

  const body = { query: trimmed, page: 1, limit };

  const [destinations, stays, experiences, stories] = await Promise.all([
    apiFetch<{ destinations: ApiDestinationListItem[] }>("/destinations/search", {
      method: "POST",
      body,
    }).catch(() => ({ destinations: [] as ApiDestinationListItem[] })),
    apiFetch<{ stays: ApiStayListItem[] }>("/stays/search", {
      method: "POST",
      body,
    }).catch(() => ({ stays: [] as ApiStayListItem[] })),
    apiFetch<{ experiences: ApiExperienceListItem[] }>("/experiences/search", {
      method: "POST",
      body,
    }).catch(() => ({ experiences: [] as ApiExperienceListItem[] })),
    apiFetch<{ stories: ApiStoryListItem[] }>("/stories/search", {
      method: "POST",
      body,
    }).catch(() => ({ stories: [] as ApiStoryListItem[] })),
  ]);

  return {
    destinations: destinations.destinations.map(mapDestinationListItem),
    stays: stays.stays.map(mapStayListItem),
    experiences: experiences.experiences.map(mapExperienceListItem),
    stories: stories.stories.map(mapJournalStory),
  };
}

export async function searchDestinationsApi(
  query: string,
  limit = 12,
): Promise<DestinationListItem[]> {
  const response = await apiFetch<{ destinations: ApiDestinationListItem[] }>(
    "/destinations/search",
    {
      method: "POST",
      body: { query, page: 1, limit },
    },
  );
  return response.destinations.map(mapDestinationListItem);
}

export async function searchStaysApi(query: string, limit = 12): Promise<StayListItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await apiFetch<{ stays: ApiStayListItem[] }>("/stays/search", {
    method: "POST",
    body: { query: trimmed, page: 1, limit },
  });
  return response.stays.map(mapStayListItem);
}

export async function searchExperiencesApi(
  query: string,
  limit = 12,
): Promise<ExperienceListItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await apiFetch<{ experiences: ApiExperienceListItem[] }>("/experiences/search", {
    method: "POST",
    body: { query: trimmed, page: 1, limit },
  });
  return response.experiences.map(mapExperienceListItem);
}

export async function searchRestaurantsApi(
  query: string,
  limit = 12,
): Promise<RestaurantListItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await apiFetch<{ restaurants: ApiRestaurantListItem[] }>("/restaurants/search", {
    method: "POST",
    body: { query: trimmed, page: 1, limit },
  });
  return response.restaurants.map(mapRestaurantListItem);
}
