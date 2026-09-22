import { JOURNAL_FIXTURE } from "@/data/fixtures/loaders/journal";
import type { JournalStory } from "@/types/journal";

/** Featured editorial story for the homepage journal — JSON fixture-backed until REST is wired. */
export function getFeaturedJournalStory(): JournalStory | undefined {
  return JOURNAL_FIXTURE.find((item) => item.isFeatured);
}

export function getSupportingJournalStories(): JournalStory[] {
  return JOURNAL_FIXTURE.filter((item) => !item.isFeatured);
}

/** Full editorial set for carousel surfaces — featured story first. */
export function getJournalStories(): JournalStory[] {
  const featured = getFeaturedJournalStory();
  const supporting = getSupportingJournalStories();

  if (!featured) {
    return JOURNAL_FIXTURE;
  }

  return [featured, ...supporting];
}

export function getJournalStoryBySlug(slug: string): JournalStory | undefined {
  return JOURNAL_FIXTURE.find((item) => item.slug === slug);
}
