import { AppError } from "../../lib/errors.js";
import { storiesRepository } from "./stories.repository.js";
import type { StorySearchInput } from "./stories.schemas.js";
import {
  buildPaginationMeta,
  listStoryCategories,
  toStoryDetail,
  toStoryListItem,
} from "./stories.types.js";

export const storiesService = {
  async list(input: {
    page: number;
    limit: number;
    category?: StorySearchInput["category"];
    featured?: boolean;
  }) {
    const [stories, total] = await storiesRepository.list(input);

    return {
      stories: stories.map(toStoryListItem),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total,
      }),
    };
  },

  async listFeatured() {
    const stories = await storiesRepository.listFeatured();
    return stories.map(toStoryListItem);
  },

  listCategories() {
    return listStoryCategories();
  },

  async search(input: StorySearchInput) {
    const [stories, total] = await storiesRepository.search(input);

    return {
      stories: stories.map(toStoryListItem),
      meta: buildPaginationMeta({
        page: input.page,
        limit: input.limit,
        total,
      }),
    };
  },

  async getBySlug(slug: string) {
    const story = await storiesRepository.findBySlug(slug);
    if (!story) {
      throw new AppError(404, "NOT_FOUND", "Story not found.");
    }

    return toStoryDetail(story);
  },
};
