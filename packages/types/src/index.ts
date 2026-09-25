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
  status: "draft" | "upcoming" | "active" | "completed";
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

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiDataEnvelope<T> = {
  data: T;
};
