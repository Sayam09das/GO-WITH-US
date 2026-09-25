import type { StoryListItem as ApiStoryListItem } from "@gowithus/types";
import { JOURNAL_FIXTURE } from "@/data/fixtures/loaders/journal";
import type { JournalStory } from "@/types/journal";
import { apiFetch } from "./client";
import { mapJournalStory } from "./mappers";

type StoryListResponse = {
  stories: ApiStoryListItem[];
};

export async function getFeaturedJournalStory(): Promise<JournalStory | undefined> {
  const stories = await getJournalStories();
  return stories.find((item) => item.isFeatured);
}

export async function getSupportingJournalStories(): Promise<JournalStory[]> {
  const stories = await getJournalStories();
  return stories.filter((item) => !item.isFeatured);
}

export async function getJournalStories(): Promise<JournalStory[]> {
  try {
    const response = await apiFetch<StoryListResponse>("/stories?limit=20&page=1");
    const mapped = response.stories.map(mapJournalStory);
    const featured = mapped.find((item) => item.isFeatured);
    const supporting = mapped.filter((item) => !item.isFeatured);
    return featured ? [featured, ...supporting] : mapped;
  } catch {
    const featured = JOURNAL_FIXTURE.find((item) => item.isFeatured);
    const supporting = JOURNAL_FIXTURE.filter((item) => !item.isFeatured);
    return featured ? [featured, ...supporting] : JOURNAL_FIXTURE;
  }
}

export async function getJournalStoryBySlug(slug: string): Promise<JournalStory | undefined> {
  const stories = await getJournalStories();
  return stories.find((item) => item.slug === slug);
}
