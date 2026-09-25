import { CACHE_KEYS, CACHE_TTL } from "../../infrastructure/cache/cache.keys.js";
import { cacheService } from "../../infrastructure/cache/cache.service.js";
import { destinationsRepository } from "../destinations/destinations.repository.js";
import { toDestinationListItem } from "../destinations/destinations.types.js";
import { experiencesRepository } from "../experiences/experiences.repository.js";
import { toExperienceListItem } from "../experiences/experiences.types.js";
import { storiesRepository } from "../stories/stories.repository.js";
import { toStoryListItem } from "../stories/stories.types.js";

export const discoveryService = {
  async getHomepageFeed(userId?: string) {
    const feed = await cacheService.getOrSet(
      CACHE_KEYS.discoveryHomepage,
      CACHE_TTL.discoveryHomepage,
      async () => {
        const [destinations, experiences, stories] = await Promise.all([
          destinationsRepository.listFeatured(),
          experiencesRepository.listFeatured(),
          storiesRepository.listFeatured(),
        ]);

        return {
          destinations: destinations.map((destination) =>
            toDestinationListItem(destination, false),
          ),
          experiences: experiences.map((experience) => toExperienceListItem(experience, false)),
          stories: stories.map(toStoryListItem),
        };
      },
    );

    if (!userId) {
      return feed;
    }

    const [savedDestinationIds, savedExperienceIds] = await Promise.all([
      destinationsRepository.findSavedDestinationIds(
        userId,
        feed.destinations.map((destination) => destination.id),
      ),
      experiencesRepository.findSavedExperienceIds(
        userId,
        feed.experiences.map((experience) => experience.id),
      ),
    ]);

    return {
      destinations: feed.destinations.map((destination) => ({
        ...destination,
        isSaved: savedDestinationIds.has(destination.id),
      })),
      experiences: feed.experiences.map((experience) => ({
        ...experience,
        isSaved: savedExperienceIds.has(experience.id),
      })),
      stories: feed.stories,
    };
  },
};
