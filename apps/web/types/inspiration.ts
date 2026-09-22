/** Editorial story shape for homepage inspiration and future guide routes. */
export interface InspirationStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readLabel: string;
  heroImage: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
}
