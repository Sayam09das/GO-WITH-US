import type {
  SavedDestinationSummary,
  SavedExperienceSummary,
  SavedRestaurantSummary,
  SavedStaySummary,
  UserActivityItem,
  UserProfile,
} from "@gowithus/types";
import { notifyNavCountsChanged } from "@/lib/navigation/nav-counts-events";
import { apiFetch, apiUpload } from "./client";

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
  const response = await apiFetch<SavedDestinationsResponse>("/users/me/saved-destinations");
  return response.savedDestinations;
}

export async function listSavedStays(): Promise<SavedStaySummary[]> {
  const response = await apiFetch<SavedStaysResponse>("/users/me/saved-stays");
  return response.savedStays;
}

export async function listSavedExperiences(): Promise<SavedExperienceSummary[]> {
  const response = await apiFetch<SavedExperiencesResponse>("/users/me/saved-experiences");
  return response.savedExperiences;
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
  notifyNavCountsChanged();
}

export async function unsaveDestination(destinationId: string): Promise<void> {
  await apiFetch(`/users/me/saved-destinations/${destinationId}`, { method: "DELETE" });
  notifyNavCountsChanged();
}

export async function saveStay(stayId: string): Promise<void> {
  await apiFetch(`/users/me/saved-stays/${stayId}`, { method: "POST" });
  notifyNavCountsChanged();
}

export async function unsaveStay(stayId: string): Promise<void> {
  await apiFetch(`/users/me/saved-stays/${stayId}`, { method: "DELETE" });
  notifyNavCountsChanged();
}

export async function saveExperience(experienceId: string): Promise<void> {
  await apiFetch(`/users/me/saved-experiences/${experienceId}`, { method: "POST" });
  notifyNavCountsChanged();
}

export async function unsaveExperience(experienceId: string): Promise<void> {
  await apiFetch(`/users/me/saved-experiences/${experienceId}`, { method: "DELETE" });
  notifyNavCountsChanged();
}

export async function uploadUserAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiUpload<{ user: UserProfile }>("/users/me/avatar/upload", formData);
  return response.user;
}
