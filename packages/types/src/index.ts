export type BudgetTier = "budget" | "moderate" | "luxury";

import type {
  ProfilePreferences,
  ProfileTravelInterestId,
  ProfileTravelStyleTagId,
} from "./profile.js";

export type {
  ProfilePreferences,
  ProfileTravelInterestId,
  ProfileTravelStyleTagId,
  UserProfileStats,
} from "./profile.js";
export {
  PROFILE_INTEREST_IDS,
  PROFILE_STYLE_TAG_IDS,
  PROFILE_TRAVEL_INTERESTS,
  PROFILE_TRAVEL_STYLE_TAGS,
} from "./profile.js";

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  avatarUrl: string | null;
  bio: string | null;
  homeCity: string | null;
  travelStyles: string[];
  budgetPreference: BudgetTier | null;
};

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
  homeCity: string | null;
  budgetPreference: BudgetTier | null;
  travelInterests: ProfileTravelInterestId[];
  travelStyleTags: ProfileTravelStyleTagId[];
  preferences: ProfilePreferences;
};

export type TripSummary = {
  id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  coverImage: string | null;
  status: "draft" | "upcoming" | "active" | "completed" | "cancelled";
  itemCount?: number;
};

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

export type UserActivityItem = {
  id: string;
  type: string;
  title: string;
  createdAt: string;
};

export type DashboardOverview = {
  user: UserProfile;
  upcomingTrips: TripSummary[];
  savedDestinations: SavedDestinationSummary[];
  savedStays: SavedStaySummary[];
  recentStories: [];
  recentActivity: UserActivityItem[];
};

export type DestinationListItem = {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  region: string;
  style: string | null;
  category: string | null;
  budgetTier: BudgetTier;
  popularity: number;
  rating: number;
  priceLabel: string;
  heroImage: string;
  imageAlt: string;
  isSaved: boolean;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StayListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  propertyType: string;
  description?: string;
  coverImage: string;
  imageAlt: string;
  price: {
    nightlyFrom: number | null;
    label: string;
    tier: BudgetTier;
  };
  rating: number;
  reviewCount: number;
  amenities: string[];
  isFeatured?: boolean;
  isSaved: boolean;
};

export type StayReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
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

export type ExperienceListItem = {
  id: string;
  name: string;
  title?: string;
  slug: string;
  destination: string;
  category: string;
  categoryLabel?: string;
  description?: string;
  coverImage: string;
  heroImage?: string;
  durationLabel: string | null;
  price: {
    from: number | null;
    label: string;
    tier: BudgetTier;
  };
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isSaved: boolean;
};

export type RestaurantListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  cuisine: string;
  coverImage: string;
  priceLevel: number;
  rating: number;
  reviewCount: number;
  isSaved: boolean;
};

export type PlaceListItem = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  category: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  tags: string[];
};

export type BookingSummary = {
  id: string;
  reference: string;
  type: "stay" | "experience";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "expired";
  paymentStatus: "unpaid" | "pending" | "paid" | "failed" | "refunded";
  startDate: string | null;
  endDate: string | null;
  guestCount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export type TravelDocumentCategory =
  | "bookings"
  | "flights"
  | "stays"
  | "experiences"
  | "invoices"
  | "other";

export type TravelDocumentSummary = {
  id: string;
  name: string;
  category: TravelDocumentCategory;
  tripId: string | null;
  tripLabel: string | null;
  dateLabel: string;
  mimeType: string;
  fileType: string;
  fileSizeLabel: string;
  sizeBytes: number;
  publicUrl: string;
  createdAt: string;
};

export type StoryListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  authorName: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  publishedAt: string | null;
};

export type RatingAggregate = {
  averageRating: number;
  reviewCount: number;
  ratingDistribution: Record<"1" | "2" | "3" | "4" | "5", number>;
};

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiDataEnvelope<T> = {
  data: T;
};

export type NotificationType = "trip_reminder" | "itinerary_alert" | "system";

export type NotificationFilterCategory = "trips" | "bookings" | "itineraries" | "updates";

export type NotificationAction = {
  label: string;
  href: string;
};

export type NotificationSummary = {
  id: string;
  type: NotificationType;
  filterCategory: NotificationFilterCategory;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  action: NotificationAction | null;
};

export type NotificationListResponse = {
  items: NotificationSummary[];
  unreadCount: number;
};
