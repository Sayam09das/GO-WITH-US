export type BudgetTier = "budget" | "moderate" | "luxury";

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
  slug: string;
  destination: string;
  category: string;
  coverImage: string;
  durationLabel: string | null;
  price: {
    from: number | null;
    label: string;
    tier: BudgetTier;
  };
  rating: number;
  reviewCount: number;
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

export type BookingSummary = {
  id: string;
  reference: string;
  type: "stay" | "experience";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "expired";
  paymentStatus: "unpaid" | "pending" | "paid" | "failed" | "refunded";
  startDate: string | null;
  endDate: string | null;
  totalAmount: number;
  currency: string;
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
