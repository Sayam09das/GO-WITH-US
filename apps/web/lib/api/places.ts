import type { PlaceListItem as ApiPlaceListItem } from "@gowithus/types";
import { apiFetch } from "./client";

type PlaceListResponse = {
  places: ApiPlaceListItem[];
};

export type PlaceListItem = ApiPlaceListItem;

export async function getAllPlaces(): Promise<PlaceListItem[]> {
  const response = await apiFetch<PlaceListResponse>("/places?limit=100&page=1");
  return response.places;
}

export async function getFeaturedPlaces(): Promise<PlaceListItem[]> {
  const response = await apiFetch<{ places: ApiPlaceListItem[] }>("/places/featured");
  return response.places;
}

export async function getPlaceBySlug(slug: string): Promise<PlaceListItem | undefined> {
  try {
    const response = await apiFetch<{ place: ApiPlaceListItem }>(`/places/${slug}`);
    return response.place;
  } catch {
    return undefined;
  }
}
