import type {
  SavedDestinationSummary,
  SavedExperienceSummary,
  SavedRestaurantSummary,
  SavedStaySummary,
  UserActivityItem,
  UserProfile,
} from "@gowithus/types";
import { apiFetch } from "./client";

type UserResponse = { user: UserProfile };
type SavedDestinationsResponse = { savedDestinations: SavedDestinationSummary[] };
type SavedStaysResponse = { savedStays: SavedStaySummary[] };
type SavedExperiencesResponse = { savedExperiences: SavedExperienceSummary[] };
type SavedRestaurantsResponse = { savedRestaurants: SavedRestaurantSummary[] };
type ActivityResponse = { activity: UserActivityItem[] };

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiFetch<UserResponse>("/users/me");
    return response.user;
  } catch {
    return null;
  }
}

export async function updateUserProfile(
  input: Partial<Pick<UserProfile, "name" | "bio" | "phone" | "country" | "timezone">>,
): Promise<UserProfile> {
  const response = await apiFetch<UserResponse>("/users/me", {
    method: "PATCH",
    body: input,
  });
  return response.user;
}

export async function listSavedDestinations(): Promise<SavedDestinationSummary[]> {
  try {
    const response = await apiFetch<SavedDestinationsResponse>("/users/me/saved-destinations");
    return response.savedDestinations;
  } catch {
    return [];
  }
}

export async function listSavedStays(): Promise<SavedStaySummary[]> {
  try {
    const response = await apiFetch<SavedStaysResponse>("/users/me/saved-stays");
    return response.savedStays;
  } catch {
    return [];
  }
}

export async function listSavedExperiences(): Promise<SavedExperienceSummary[]> {
  try {
    const response = await apiFetch<SavedExperiencesResponse>("/users/me/saved-experiences");
    return response.savedExperiences;
  } catch {
    return [];
  }
}

export async function listSavedRestaurants(): Promise<SavedRestaurantSummary[]> {
  try {
    const response = await apiFetch<SavedRestaurantsResponse>("/users/me/saved-restaurants");
    return response.savedRestaurants;
  } catch {
    return [];
  }
}

export async function listUserActivity(): Promise<UserActivityItem[]> {
  try {
    const response = await apiFetch<ActivityResponse>("/users/me/activity");
    return response.activity;
  } catch {
    return [];
  }
}

export async function saveDestination(destinationId: string): Promise<void> {
  await apiFetch(`/users/me/saved-destinations/${destinationId}`, { method: "POST" });
}

export async function unsaveDestination(destinationId: string): Promise<void> {
  await apiFetch(`/users/me/saved-destinations/${destinationId}`, { method: "DELETE" });
}

export async function saveStay(stayId: string): Promise<void> {
  await apiFetch(`/users/me/saved-stays/${stayId}`, { method: "POST" });
}

export async function unsaveStay(stayId: string): Promise<void> {
  await apiFetch(`/users/me/saved-stays/${stayId}`, { method: "DELETE" });
}

export async function saveExperience(experienceId: string): Promise<void> {
  await apiFetch(`/users/me/saved-experiences/${experienceId}`, { method: "POST" });
}

export async function unsaveExperience(experienceId: string): Promise<void> {
  await apiFetch(`/users/me/saved-experiences/${experienceId}`, { method: "DELETE" });
}
