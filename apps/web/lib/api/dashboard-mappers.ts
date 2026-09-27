import type {
  DashboardOverview,
  PublicUser,
  SavedDestinationSummary,
  SavedExperienceSummary,
  SavedStaySummary,
  TripSummary,
  UserActivityItem,
  UserProfile,
} from "@gowithus/types";
import type { DashboardUser } from "@/lib/account/dashboard/config";
import type { RecentlyViewedItem, RecentlyViewedType } from "@/lib/account/dashboard/recent-config";
import type { SavedPlaceItem } from "@/lib/account/dashboard/saved-places-config";
import type { UpcomingTrip } from "@/lib/account/dashboard/upcoming-trip-config";
import { getUserFirstName, getUserInitials } from "@/lib/auth/user-display";

const DEFAULT_IMAGE = {
  src: "/landingImg/travelimg/travel-5.jpg",
  alt: "Travel destination",
  objectPosition: "object-center",
};

function formatDisplayDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) {
    return "Dates to be confirmed";
  }

  if (!endDate || endDate === startDate) {
    return formatDisplayDate(startDate);
  }

  return `${formatDisplayDate(startDate)} — ${formatDisplayDate(endDate)}`;
}

function countNights(startDate: string | null, endDate: string | null): number | null {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const end = new Date(`${endDate}T00:00:00.000Z`).getTime();
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : null;
}

export function mapPublicUserToDashboardUser(user: PublicUser): DashboardUser {
  const firstName = getUserFirstName(user);
  return {
    firstName,
    fullName: user.fullName,
    email: user.email,
    initials: getUserInitials(user.fullName),
  };
}

export function mapUserProfileToDashboardUser(user: UserProfile): DashboardUser {
  const parts = user.name.trim().split(/\s+/);
  const firstName = parts[0] ?? user.name;
  const initials = parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    firstName,
    fullName: user.name,
    email: user.email,
    initials: initials || firstName.slice(0, 1).toUpperCase(),
  };
}

export function mapTripSummaryToUpcomingTrip(trip: TripSummary): UpcomingTrip {
  const nights = countNights(trip.startDate, trip.endDate);
  const destinationLabel = trip.destination ?? "Your next journey";

  return {
    id: trip.id,
    destination: destinationLabel,
    country: destinationLabel,
    dateRange: formatDateRange(trip.startDate, trip.endDate),
    nightsLabel: nights ? `${destinationLabel} · ${nights} nights` : destinationLabel,
    description: trip.title,
    status: "confirmed",
    statusLabel: trip.status.charAt(0).toUpperCase() + trip.status.slice(1),
    image: {
      src: trip.coverImage ?? DEFAULT_IMAGE.src,
      alt: trip.title,
      objectPosition: DEFAULT_IMAGE.objectPosition,
    },
    tripHref: `/trips`,
    itineraryHref: `/account/itineraries`,
  };
}

function mapSavedDestination(item: SavedDestinationSummary): SavedPlaceItem {
  return {
    id: item.id,
    catalogId: item.destinationId,
    name: item.title,
    location: item.region,
    country: item.country,
    type: "destination",
    typeLabel: "Destination",
    description: `${item.title} in ${item.region}, ${item.country}.`,
    href: `/destinations/${item.slug}`,
    image: {
      src: item.heroImage,
      alt: item.title,
      objectPosition: DEFAULT_IMAGE.objectPosition,
    },
  };
}

function mapSavedStay(item: SavedStaySummary): SavedPlaceItem {
  return {
    id: item.id,
    catalogId: item.stayId,
    name: item.title,
    location: item.destination.title,
    country: item.destination.country,
    type: "stay",
    typeLabel: "Stay",
    description: item.locationLabel,
    href: `/stays/${item.slug}`,
    image: {
      src: item.heroImage,
      alt: item.title,
      objectPosition: DEFAULT_IMAGE.objectPosition,
    },
  };
}

function mapSavedExperience(item: SavedExperienceSummary): SavedPlaceItem {
  return {
    id: item.id,
    catalogId: item.experienceId,
    name: item.title,
    location: item.destination.title,
    country: item.destination.country,
    type: "experience",
    typeLabel: "Experience",
    description: item.category,
    href: `/experiences/${item.slug}`,
    image: {
      src: item.heroImage,
      alt: item.title,
      objectPosition: DEFAULT_IMAGE.objectPosition,
    },
  };
}

export function mapDashboardSavedPlaces(overview: DashboardOverview): SavedPlaceItem[] {
  return [
    ...overview.savedDestinations.map(mapSavedDestination),
    ...overview.savedStays.map(mapSavedStay),
  ];
}

export function mapAllSavedPlaces(input: {
  destinations: SavedDestinationSummary[];
  stays: SavedStaySummary[];
  experiences: SavedExperienceSummary[];
}): SavedPlaceItem[] {
  return [
    ...input.destinations.map(mapSavedDestination),
    ...input.stays.map(mapSavedStay),
    ...input.experiences.map(mapSavedExperience),
  ];
}

function inferRecentType(activityType: string): RecentlyViewedType {
  if (activityType.includes("stay")) {
    return "stay";
  }
  if (activityType.includes("experience")) {
    return "experience";
  }
  return "destination";
}

function inferRecentTypeLabel(type: RecentlyViewedType): string {
  switch (type) {
    case "stay":
      return "Stay";
    case "experience":
      return "Experience";
    default:
      return "Destination";
  }
}

export function mapActivityToRecentItems(activity: UserActivityItem[]): RecentlyViewedItem[] {
  return activity.slice(0, 8).map((item) => {
    const type = inferRecentType(item.type.toLowerCase());

    return {
      id: item.id,
      name: item.title,
      location: item.title,
      country: "",
      type,
      typeLabel: inferRecentTypeLabel(type),
      href: `/search?q=${encodeURIComponent(item.title)}`,
      image: DEFAULT_IMAGE,
    };
  });
}
