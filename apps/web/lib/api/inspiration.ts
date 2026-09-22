import { INSPIRATION_FIXTURE } from "@/data/fixtures/loaders/inspiration";
import type { InspirationStory } from "@/types/inspiration";

/** Homepage inspiration stories — JSON fixture-backed until REST is wired. */
export function getInspirationStories(): InspirationStory[] {
  return INSPIRATION_FIXTURE;
}

export function getFeaturedInspirationStory(): InspirationStory | undefined {
  return INSPIRATION_FIXTURE.find((story) => story.isFeatured) ?? INSPIRATION_FIXTURE[0];
}

export function getInspirationStoryBySlug(slug: string): InspirationStory | undefined {
  return INSPIRATION_FIXTURE.find((story) => story.slug === slug);
}
