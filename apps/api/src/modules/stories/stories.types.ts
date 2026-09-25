import type { Story, StoryCategory } from "../../generated/client.js";

const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  editorial: "Editorial",
  guides: "Guides",
  journeys: "Journeys",
  tips: "Tips",
  inspiration: "Inspiration",
};

export type StoryListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: StoryCategory;
  categoryLabel: string;
  coverImage: string;
  imageAlt: string;
  authorName: string;
  readTimeMinutes: number;
  readLabel: string;
  isFeatured: boolean;
  publishedAt: string | null;
};

export type StoryDetail = StoryListItem & {
  content: string;
};

export function buildPaginationMeta(input: { page: number; limit: number; total: number }) {
  return {
    page: input.page,
    limit: input.limit,
    total: input.total,
    totalPages: Math.max(1, Math.ceil(input.total / input.limit)),
  };
}

export function toStoryListItem(story: Story): StoryListItem {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    category: story.category,
    categoryLabel: STORY_CATEGORY_LABELS[story.category],
    coverImage: story.coverImage,
    imageAlt: story.title,
    authorName: story.authorName,
    readTimeMinutes: story.readTimeMinutes,
    readLabel: `${story.readTimeMinutes} min read`,
    isFeatured: story.isFeatured,
    publishedAt: story.publishedAt?.toISOString() ?? null,
  };
}

export function toStoryDetail(story: Story): StoryDetail {
  return {
    ...toStoryListItem(story),
    content: story.content,
  };
}

export function listStoryCategories() {
  return (Object.keys(STORY_CATEGORY_LABELS) as StoryCategory[]).map((value) => ({
    value,
    label: STORY_CATEGORY_LABELS[value],
  }));
}
