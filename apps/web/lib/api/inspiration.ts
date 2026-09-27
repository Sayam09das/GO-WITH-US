import type { StoryListItem as ApiStoryListItem } from "@gowithus/types";
import type { InspirationStory } from "@/types/inspiration";
import { apiFetch } from "./client";
import { mapInspirationStory } from "./mappers";

type StoryListResponse = {
  stories: ApiStoryListItem[];
};

function orderInspirationStories(items: InspirationStory[]): InspirationStory[] {
  const featured = items.find((item) => item.isFeatured);
  const supporting = items.filter((item) => !item.isFeatured);
  return featured ? [featured, ...supporting] : items;
}

async function fetchStoryList(limit: number): Promise<InspirationStory[]> {
  const response = await apiFetch<StoryListResponse>(`/stories?limit=${limit}&page=1`);
  return response.stories.map(mapInspirationStory);
}

export async function getFeaturedInspirationStory(): Promise<InspirationStory | undefined> {
  const stories = await getInspirationStories();
  return stories.find((item) => item.isFeatured) ?? stories[0];
}

export async function getInspirationStories(): Promise<InspirationStory[]> {
  try {
    return orderInspirationStories(await fetchStoryList(12));
  } catch {
    return [];
  }
}

export async function getInspirationStoryBySlug(
  slug: string,
): Promise<InspirationStory | undefined> {
  try {
    const response = await apiFetch<{ story: ApiStoryListItem }>(`/stories/${slug}`);
    return mapInspirationStory(response.story);
  } catch {
    return undefined;
  }
}
