import { logUserActivity } from "../../lib/activity.js";
import { AppError } from "../../lib/errors.js";
import { storageEnv, uploadUserFile } from "../../lib/supabase-storage.js";
import { assertAvatarMime } from "../../lib/upload.js";
import { usersRepository } from "./users.repository.js";
import type { UpdateProfileInput } from "./users.schemas.js";
import type {
  SavedDestinationSummary,
  SavedExperienceSummary,
  SavedRestaurantSummary,
  SavedStaySummary,
  UserActivityItem,
  UserProfile,
} from "./users.types.js";
import { toUserProfile } from "./users.types.js";

function isProfileComplete(profile: UserProfile): boolean {
  return Boolean(profile.name && profile.bio && profile.country && profile.timezone);
}

export const usersService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "NOT_FOUND", "User not found.");
    }

    return toUserProfile(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const user = await usersRepository.updateProfile(userId, {
      ...(input.name !== undefined ? { fullName: input.name } : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.country !== undefined ? { country: input.country } : {}),
      ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
    });

    const profile = toUserProfile(user);

    if (isProfileComplete(profile)) {
      await logUserActivity({
        userId,
        type: "COMPLETED_PROFILE",
        title: "Completed profile",
      });
    }

    return profile;
  },

  async updateAvatar(userId: string, avatar: string): Promise<UserProfile> {
    const user = await usersRepository.updateProfile(userId, { avatarUrl: avatar });
    return toUserProfile(user);
  },

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UserProfile> {
    assertAvatarMime(file.mimetype);

    const upload = await uploadUserFile({
      bucket: storageEnv.supabaseAvatarsBucket,
      userId,
      fileName: file.originalname || "avatar.jpg",
      mimeType: file.mimetype,
      buffer: file.buffer,
    });

    const user = await usersRepository.updateProfile(userId, { avatarUrl: upload.publicUrl });
    return toUserProfile(user);
  },

  async listSavedDestinations(userId: string): Promise<SavedDestinationSummary[]> {
    const savedItems = await usersRepository.listSavedDestinations(userId);
    const destinationIds = savedItems.map((item) => item.itemId);
    const destinations = await usersRepository.findDestinationsByIds(destinationIds);
    const destinationMap = new Map(
      destinations.map((destination) => [destination.id, destination]),
    );

    return savedItems.flatMap((item) => {
      const destination = destinationMap.get(item.itemId);
      if (!destination) {
        return [];
      }

      return [
        {
          id: item.id,
          destinationId: destination.id,
          slug: destination.slug,
          title: destination.title,
          country: destination.country,
          region: destination.region,
          heroImage: destination.heroImage,
          savedAt: item.createdAt.toISOString(),
        },
      ];
    });
  },

  async saveDestination(userId: string, destinationId: string): Promise<SavedDestinationSummary> {
    const destination = await usersRepository.findPublishedDestination(destinationId);

    if (!destination) {
      throw new AppError(404, "NOT_FOUND", "Destination not found.");
    }

    const existing = await usersRepository.findSavedDestination(userId, destinationId);
    if (existing) {
      throw new AppError(409, "CONFLICT", "Destination is already saved.");
    }

    const savedItem = await usersRepository.createSavedItem(userId, "destination", destinationId);

    await logUserActivity({
      userId,
      type: "SAVED_DESTINATION",
      title: `Saved ${destination.title}`,
      metadata: { destinationId: destination.id, slug: destination.slug },
    });

    return {
      id: savedItem.id,
      destinationId: destination.id,
      slug: destination.slug,
      title: destination.title,
      country: destination.country,
      region: destination.region,
      heroImage: destination.heroImage,
      savedAt: savedItem.createdAt.toISOString(),
    };
  },

  async unsaveDestination(userId: string, destinationId: string): Promise<void> {
    const savedItem = await usersRepository.findSavedDestination(userId, destinationId);

    if (!savedItem) {
      throw new AppError(404, "NOT_FOUND", "Saved destination not found.");
    }

    const destination = await usersRepository.findPublishedDestination(destinationId);
    await usersRepository.deleteSavedItem(savedItem.id);

    if (destination) {
      await logUserActivity({
        userId,
        type: "UNSAVED_DESTINATION",
        title: `Removed ${destination.title}`,
        metadata: { destinationId: destination.id, slug: destination.slug },
      });
    }
  },

  async listSavedStays(userId: string): Promise<SavedStaySummary[]> {
    const savedItems = await usersRepository.listSavedStays(userId);
    const stayIds = savedItems.map((item) => item.itemId);
    const stays = await usersRepository.findStaysByIds(stayIds);
    const stayMap = new Map(stays.map((stay) => [stay.id, stay]));

    return savedItems.flatMap((item) => {
      const stay = stayMap.get(item.itemId);
      if (!stay) {
        return [];
      }

      return [
        {
          id: item.id,
          stayId: stay.id,
          slug: stay.slug,
          title: stay.title,
          locationLabel: stay.locationLabel,
          heroImage: stay.heroImage,
          destination: {
            id: stay.destination.id,
            title: stay.destination.title,
            country: stay.destination.country,
          },
          savedAt: item.createdAt.toISOString(),
        },
      ];
    });
  },

  async saveStay(userId: string, stayId: string): Promise<SavedStaySummary> {
    const stay = await usersRepository.findPublishedStay(stayId);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const existing = await usersRepository.findSavedStay(userId, stayId);
    if (existing) {
      throw new AppError(409, "CONFLICT", "Stay is already saved.");
    }

    const savedItem = await usersRepository.createSavedItem(userId, "stay", stayId);

    await logUserActivity({
      userId,
      type: "SAVED_STAY",
      title: `Saved ${stay.title}`,
      metadata: { stayId: stay.id, slug: stay.slug },
    });

    return {
      id: savedItem.id,
      stayId: stay.id,
      slug: stay.slug,
      title: stay.title,
      locationLabel: stay.locationLabel,
      heroImage: stay.heroImage,
      destination: {
        id: stay.destination.id,
        title: stay.destination.title,
        country: stay.destination.country,
      },
      savedAt: savedItem.createdAt.toISOString(),
    };
  },

  async unsaveStay(userId: string, stayId: string): Promise<void> {
    const savedItem = await usersRepository.findSavedStay(userId, stayId);

    if (!savedItem) {
      throw new AppError(404, "NOT_FOUND", "Saved stay not found.");
    }

    const stay = await usersRepository.findPublishedStay(stayId);
    await usersRepository.deleteSavedItem(savedItem.id);

    if (stay) {
      await logUserActivity({
        userId,
        type: "UNSAVED_STAY",
        title: `Removed ${stay.title}`,
        metadata: { stayId: stay.id, slug: stay.slug },
      });
    }
  },

  async listSavedExperiences(userId: string): Promise<SavedExperienceSummary[]> {
    const savedItems = await usersRepository.listSavedExperiences(userId);
    const experienceIds = savedItems.map((item) => item.itemId);
    const experiences = await usersRepository.findExperiencesByIds(experienceIds);
    const experienceMap = new Map(experiences.map((experience) => [experience.id, experience]));

    return savedItems.flatMap((item) => {
      const experience = experienceMap.get(item.itemId);
      if (!experience) {
        return [];
      }

      return [
        {
          id: item.id,
          experienceId: experience.id,
          slug: experience.slug,
          title: experience.title,
          category: experience.category.replace(/_/g, "-"),
          heroImage: experience.heroImage,
          destination: {
            id: experience.destination.id,
            title: experience.destination.title,
            country: experience.destination.country,
          },
          savedAt: item.createdAt.toISOString(),
        },
      ];
    });
  },

  async saveExperience(userId: string, experienceId: string): Promise<SavedExperienceSummary> {
    const experience = await usersRepository.findPublishedExperience(experienceId);

    if (!experience) {
      throw new AppError(404, "NOT_FOUND", "Experience not found.");
    }

    const existing = await usersRepository.findSavedExperience(userId, experienceId);
    if (existing) {
      throw new AppError(409, "CONFLICT", "Experience is already saved.");
    }

    const savedItem = await usersRepository.createSavedItem(userId, "experience", experienceId);

    await logUserActivity({
      userId,
      type: "SAVED_EXPERIENCE",
      title: `Saved ${experience.title}`,
      metadata: { experienceId: experience.id, slug: experience.slug },
    });

    return {
      id: savedItem.id,
      experienceId: experience.id,
      slug: experience.slug,
      title: experience.title,
      category: experience.category.replace(/_/g, "-"),
      heroImage: experience.heroImage,
      destination: {
        id: experience.destination.id,
        title: experience.destination.title,
        country: experience.destination.country,
      },
      savedAt: savedItem.createdAt.toISOString(),
    };
  },

  async unsaveExperience(userId: string, experienceId: string): Promise<void> {
    const savedItem = await usersRepository.findSavedExperience(userId, experienceId);

    if (!savedItem) {
      throw new AppError(404, "NOT_FOUND", "Saved experience not found.");
    }

    const experience = await usersRepository.findPublishedExperience(experienceId);
    await usersRepository.deleteSavedItem(savedItem.id);

    if (experience) {
      await logUserActivity({
        userId,
        type: "UNSAVED_EXPERIENCE",
        title: `Removed ${experience.title}`,
        metadata: { experienceId: experience.id, slug: experience.slug },
      });
    }
  },

  async listSavedRestaurants(userId: string): Promise<SavedRestaurantSummary[]> {
    const savedItems = await usersRepository.listSavedRestaurants(userId);
    const restaurantIds = savedItems.map((item) => item.itemId);
    const restaurants = await usersRepository.findRestaurantsByIds(restaurantIds);
    const restaurantMap = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]));

    return savedItems.flatMap((item) => {
      const restaurant = restaurantMap.get(item.itemId);
      if (!restaurant) {
        return [];
      }

      return [
        {
          id: item.id,
          restaurantId: restaurant.id,
          slug: restaurant.slug,
          title: restaurant.title,
          cuisine: restaurant.cuisine,
          heroImage: restaurant.heroImage,
          destination: {
            id: restaurant.destination.id,
            title: restaurant.destination.title,
            country: restaurant.destination.country,
          },
          savedAt: item.createdAt.toISOString(),
        },
      ];
    });
  },

  async saveRestaurant(userId: string, restaurantId: string): Promise<SavedRestaurantSummary> {
    const restaurant = await usersRepository.findPublishedRestaurant(restaurantId);

    if (!restaurant) {
      throw new AppError(404, "NOT_FOUND", "Restaurant not found.");
    }

    const existing = await usersRepository.findSavedRestaurant(userId, restaurantId);
    if (existing) {
      throw new AppError(409, "CONFLICT", "Restaurant is already saved.");
    }

    const savedItem = await usersRepository.createSavedItem(userId, "restaurant", restaurantId);

    await logUserActivity({
      userId,
      type: "SAVED_RESTAURANT",
      title: `Saved ${restaurant.title}`,
      metadata: { restaurantId: restaurant.id, slug: restaurant.slug },
    });

    return {
      id: savedItem.id,
      restaurantId: restaurant.id,
      slug: restaurant.slug,
      title: restaurant.title,
      cuisine: restaurant.cuisine,
      heroImage: restaurant.heroImage,
      destination: {
        id: restaurant.destination.id,
        title: restaurant.destination.title,
        country: restaurant.destination.country,
      },
      savedAt: savedItem.createdAt.toISOString(),
    };
  },

  async unsaveRestaurant(userId: string, restaurantId: string): Promise<void> {
    const savedItem = await usersRepository.findSavedRestaurant(userId, restaurantId);

    if (!savedItem) {
      throw new AppError(404, "NOT_FOUND", "Saved restaurant not found.");
    }

    const restaurant = await usersRepository.findPublishedRestaurant(restaurantId);
    await usersRepository.deleteSavedItem(savedItem.id);

    if (restaurant) {
      await logUserActivity({
        userId,
        type: "UNSAVED_RESTAURANT",
        title: `Removed ${restaurant.title}`,
        metadata: { restaurantId: restaurant.id, slug: restaurant.slug },
      });
    }
  },

  async listActivity(userId: string): Promise<UserActivityItem[]> {
    const activities = await usersRepository.listActivities(userId);

    return activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      createdAt: activity.createdAt.toISOString(),
    }));
  },
};
