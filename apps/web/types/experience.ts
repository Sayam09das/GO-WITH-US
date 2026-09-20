export type ExperienceCategory = "tours" | "outdoor" | "cultural" | "food-dining" | "attractions";

/** List/card shape used on discovery surfaces and homepage editorial blocks. */
export interface ExperienceListItem {
  id: string;
  slug: string;
  title: string;
  destination: string;
  category: ExperienceCategory;
  categoryLabel: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
}
