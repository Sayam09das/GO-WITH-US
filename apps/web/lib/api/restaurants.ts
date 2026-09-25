import type { RestaurantListItem as ApiRestaurantListItem } from "@gowithus/types";
import type { RestaurantListItem } from "@/types/restaurant";
import { apiFetch } from "./client";
import { mapRestaurantListItem } from "./mappers";

type RestaurantListResponse = {
  restaurants: ApiRestaurantListItem[];
};

export async function getAllRestaurants(): Promise<RestaurantListItem[]> {
  try {
    const response = await apiFetch<RestaurantListResponse>("/restaurants?limit=100&page=1");
    return response.restaurants.map(mapRestaurantListItem);
  } catch {
    return [];
  }
}

export async function getFeaturedRestaurants(): Promise<RestaurantListItem[]> {
  try {
    const response = await apiFetch<{ restaurants: ApiRestaurantListItem[] }>(
      "/restaurants/featured",
    );
    return response.restaurants.map(mapRestaurantListItem);
  } catch {
    return [];
  }
}

export async function getRestaurantBySlug(slug: string): Promise<RestaurantListItem | undefined> {
  try {
    const response = await apiFetch<{ restaurant: ApiRestaurantListItem }>(`/restaurants/${slug}`);
    return mapRestaurantListItem(response.restaurant);
  } catch {
    return undefined;
  }
}
