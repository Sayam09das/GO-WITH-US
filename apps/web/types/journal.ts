export type JournalCategory =
  | "destination-guide"
  | "local-culture"
  | "food-travel"
  | "weekend-escape"
  | "road-trips"
  | "travel-tips";

export type JournalLayoutVariant = "horizontal" | "tall" | "compact";

/** Editorial journal shape for homepage and future guide routes. */
export interface JournalStory {
  id: string;
  slug: string;
  title: string;
  destination: string;
  excerpt: string;
  category: JournalCategory;
  categoryLabel: string;
  readLabel: string;
  heroImage: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
  layoutVariant?: JournalLayoutVariant;
}
