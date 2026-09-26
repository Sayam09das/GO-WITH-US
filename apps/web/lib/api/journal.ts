import type { StoryListItem as ApiStoryListItem } from "@gowithus/types";
import type { JournalStory } from "@/types/journal";
import { apiFetch } from "./client";
import { mapJournalStory } from "./mappers";

type StoryListResponse = {
  stories: ApiStoryListItem[];
};

function orderJournalStories(items: JournalStory[]): JournalStory[] {
  const featured = items.find((item) => item.isFeatured);
  const supporting = items.filter((item) => !item.isFeatured);
  return featured ? [featured, ...supporting] : items;
}

async function fetchStoryList(limit: number): Promise<JournalStory[]> {
  const response = await apiFetch<StoryListResponse>(`/stories?limit=${limit}&page=1`);
  return response.stories.map(mapJournalStory);
}

export async function getFeaturedJournalStory(): Promise<JournalStory | undefined> {
  const stories = await getJournalStories();
  return stories.find((item) => item.isFeatured) ?? stories[0];
}

export async function getSupportingJournalStories(): Promise<JournalStory[]> {
  const stories = await getJournalStories();
  return stories.filter((item) => !item.isFeatured);
}

export async function getJournalStories(): Promise<JournalStory[]> {
  try {
    const response = await apiFetch<StoryListResponse>("/stories/featured");
    const mapped = orderJournalStories(response.stories.map(mapJournalStory));
    if (mapped.length > 0) {
      return mapped;
    }
  } catch {
    // Fall through to full catalog list.
  }

  try {
    return orderJournalStories(await fetchStoryList(20));
  } catch {
    return [];
  }
}

export async function getJournalStoryBySlug(slug: string): Promise<JournalStory | undefined> {
  try {
    const response = await apiFetch<{ story: ApiStoryListItem }>(`/stories/${slug}`);
    return mapJournalStory(response.story);
  } catch {
    return undefined;
  }
}
