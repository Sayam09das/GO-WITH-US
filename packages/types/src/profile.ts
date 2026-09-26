export const PROFILE_TRAVEL_INTERESTS = [
  { id: "nature", label: "Nature" },
  { id: "beaches", label: "Beaches" },
  { id: "mountains", label: "Mountains" },
  { id: "culture", label: "Culture" },
  { id: "food", label: "Food" },
  { id: "architecture", label: "Architecture" },
  { id: "adventure", label: "Adventure" },
  { id: "wellness", label: "Wellness" },
  { id: "photography", label: "Photography" },
  { id: "city-breaks", label: "City breaks" },
] as const;

export const PROFILE_TRAVEL_STYLE_TAGS = [
  { id: "slow-travel", label: "Slow travel" },
  { id: "luxury", label: "Luxury" },
  { id: "budget", label: "Budget" },
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "adventure-style", label: "Adventure" },
] as const;

export type ProfileTravelInterestId = (typeof PROFILE_TRAVEL_INTERESTS)[number]["id"];
export type ProfileTravelStyleTagId = (typeof PROFILE_TRAVEL_STYLE_TAGS)[number]["id"];

export type ProfilePreferences = {
  dateOfBirth?: string | null;
  preferredCurrency?: string | null;
  preferredLanguage?: string | null;
  travelPace?: string | null;
  accommodationPreference?: string | null;
};

export type UserProfileStats = {
  savedPlaces: number;
  trips: number;
  storiesSaved: number;
};

export type UserProfileDetails = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  emailVerified: boolean;
  homeCity: string | null;
  budgetPreference: "budget" | "moderate" | "luxury" | null;
  travelInterests: ProfileTravelInterestId[];
  travelStyleTags: ProfileTravelStyleTagId[];
  preferences: ProfilePreferences;
};

export const PROFILE_INTEREST_IDS = new Set<string>(
  PROFILE_TRAVEL_INTERESTS.map((item) => item.id),
);

export const PROFILE_STYLE_TAG_IDS = new Set<string>(
  PROFILE_TRAVEL_STYLE_TAGS.map((item) => item.id),
);
