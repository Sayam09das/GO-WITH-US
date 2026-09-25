import "server-only";

import type {
  SavedDestinationSummary,
  SavedExperienceSummary,
  SavedRestaurantSummary,
  SavedStaySummary,
  UserActivityItem,
  UserProfile,
} from "@gowithus/types";
import { serverApiFetch } from "./server";

type UserResponse = { user: UserProfile };
type SavedDestinationsResponse = { savedDestinations: SavedDestinationSummary[] };
type SavedStaysResponse = { savedStays: SavedStaySummary[] };
type SavedExperiencesResponse = { savedExperiences: SavedExperienceSummary[] };
type SavedRestaurantsResponse = { savedRestaurants: SavedRestaurantSummary[] };
type ActivityResponse = { activity: UserActivityItem[] };

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await serverApiFetch<UserResponse>("/users/me");
    return response.user;
  } catch {
    return null;
  }
}

export async function listSavedDestinations(): Promise<SavedDestinationSummary[]> {
  try {
    const response = await serverApiFetch<SavedDestinationsResponse>(
      "/users/me/saved-destinations",
    );
    return response.savedDestinations;
  } catch {
    return [];
  }
}

export async function listSavedStays(): Promise<SavedStaySummary[]> {
  try {
    const response = await serverApiFetch<SavedStaysResponse>("/users/me/saved-stays");
    return response.savedStays;
  } catch {
    return [];
  }
}

export async function listSavedExperiences(): Promise<SavedExperienceSummary[]> {
  try {
    const response = await serverApiFetch<SavedExperiencesResponse>("/users/me/saved-experiences");
    return response.savedExperiences;
  } catch {
    return [];
  }
}

export async function listSavedRestaurants(): Promise<SavedRestaurantSummary[]> {
  try {
    const response = await serverApiFetch<SavedRestaurantsResponse>("/users/me/saved-restaurants");
    return response.savedRestaurants;
  } catch {
    return [];
  }
}

export async function listUserActivity(): Promise<UserActivityItem[]> {
  try {
    const response = await serverApiFetch<ActivityResponse>("/users/me/activity");
    return response.activity;
  } catch {
    return [];
  }
}
