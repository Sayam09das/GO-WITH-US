import { logUserActivity } from "../../lib/activity.js";
import { AppError } from "../../lib/errors.js";
import { usersRepository } from "./users.repository.js";
import type { UpdateProfileInput } from "./users.schemas.js";
import type {
  SavedDestinationSummary,
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
