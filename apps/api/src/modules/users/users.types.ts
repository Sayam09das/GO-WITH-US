import type { User } from "../../generated/client.js";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  emailVerified: boolean;
};

export function toUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    avatar: user.avatarUrl,
    bio: user.bio,
    phone: user.phone,
    country: user.country,
    timezone: user.timezone,
    emailVerified: user.emailVerified,
  };
}

export type SavedDestinationSummary = {
  id: string;
  destinationId: string;
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string;
  savedAt: string;
};

export type SavedStaySummary = {
  id: string;
  stayId: string;
  slug: string;
  title: string;
  locationLabel: string;
  heroImage: string;
  destination: {
    id: string;
    title: string;
    country: string;
  };
  savedAt: string;
};

export type SavedExperienceSummary = {
  id: string;
  experienceId: string;
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  destination: {
    id: string;
    title: string;
    country: string;
  };
  savedAt: string;
};

export type SavedRestaurantSummary = {
  id: string;
  restaurantId: string;
  slug: string;
  title: string;
  cuisine: string;
  heroImage: string;
  destination: {
    id: string;
    title: string;
    country: string;
  };
  savedAt: string;
};

export type UserActivityItem = {
  id: string;
  type: string;
  title: string;
  createdAt: string;
};
