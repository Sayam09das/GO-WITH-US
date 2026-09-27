import type { InspirationStory } from "@/types/inspiration";
import { TRAVEL_INSPIRATION_HOMEPAGE_STORY_COUNT } from "./config";

/**
 * Original homepage editorial mosaic: 1 hero, 2 stacked side cards, 2 standard cards below.
 */
export function selectHomepageInspirationStories(
  stories: InspirationStory[],
  featured?: InspirationStory,
): { featured: InspirationStory | undefined; stories: InspirationStory[] } {
  if (stories.length === 0) {
    return { featured: undefined, stories: [] };
  }

  const [head] = stories;
  if (!head) {
    return { featured: undefined, stories: [] };
  }

  const resolvedFeatured: InspirationStory =
    featured ?? stories.find((item) => item.isFeatured) ?? head;

  const ordered: InspirationStory[] = [
    resolvedFeatured,
    ...stories.filter((item) => item.id !== resolvedFeatured.id),
  ].slice(0, TRAVEL_INSPIRATION_HOMEPAGE_STORY_COUNT);

  return {
    featured: ordered[0],
    stories: ordered,
  };
}
