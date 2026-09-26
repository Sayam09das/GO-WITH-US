import type {
  ProfilePreferences,
  ProfileTravelInterestId,
  ProfileTravelStyleTagId,
  UserProfile,
} from "@gowithus/types";
import { PROFILE_INTEREST_IDS, PROFILE_STYLE_TAG_IDS } from "@gowithus/types";
import type { Prisma, User } from "../../generated/client.js";

function parseProfilePreferences(value: Prisma.JsonValue | null | undefined): ProfilePreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const record = value as Record<string, unknown>;

  return {
    dateOfBirth: typeof record.dateOfBirth === "string" ? record.dateOfBirth : null,
    preferredCurrency:
      typeof record.preferredCurrency === "string" ? record.preferredCurrency : null,
    preferredLanguage:
      typeof record.preferredLanguage === "string" ? record.preferredLanguage : null,
    travelPace: typeof record.travelPace === "string" ? record.travelPace : null,
    accommodationPreference:
      typeof record.accommodationPreference === "string" ? record.accommodationPreference : null,
  };
}

function splitTravelStyles(travelStyles: string[]): {
  travelInterests: ProfileTravelInterestId[];
  travelStyleTags: ProfileTravelStyleTagId[];
} {
  const travelInterests = travelStyles.filter((style): style is ProfileTravelInterestId =>
    PROFILE_INTEREST_IDS.has(style),
  );
  const travelStyleTags = travelStyles.filter((style): style is ProfileTravelStyleTagId =>
    PROFILE_STYLE_TAG_IDS.has(style),
  );

  return { travelInterests, travelStyleTags };
}

export function toUserProfile(user: User): UserProfile {
  const { travelInterests, travelStyleTags } = splitTravelStyles(user.travelStyles);

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
    homeCity: user.homeCity,
    budgetPreference: user.budgetPreference,
    travelInterests,
    travelStyleTags,
    preferences: parseProfilePreferences(user.profilePreferences),
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

export type { UserProfile };
