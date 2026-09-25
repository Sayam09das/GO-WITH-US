import type { StoryListItem as ApiStoryListItem } from "@gowithus/types";
import { INSPIRATION_FIXTURE } from "@/data/fixtures/loaders/inspiration";
import type { InspirationStory } from "@/types/inspiration";
import { apiFetch } from "./client";
import { mapInspirationStory } from "./mappers";

type StoryListResponse = {
  stories: ApiStoryListItem[];
};

export async function getFeaturedInspirationStory(): Promise<InspirationStory | undefined> {
  const stories = await getInspirationStories();
  return stories.find((item) => item.isFeatured);
}

export async function getInspirationStories(): Promise<InspirationStory[]> {
  try {
    const response = await apiFetch<StoryListResponse>("/stories/featured");
    return response.stories.map(mapInspirationStory);
  } catch {
    return INSPIRATION_FIXTURE;
  }
}

export async function getInspirationStoryBySlug(
  slug: string,
): Promise<InspirationStory | undefined> {
  const stories = await getInspirationStories();
  return stories.find((item) => item.slug === slug);
}
