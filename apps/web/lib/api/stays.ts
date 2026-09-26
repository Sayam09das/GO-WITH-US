import type { StayListItem as ApiStayListItem } from "@gowithus/types";
import type { StayListItem } from "@/types/stay";
import { apiFetch } from "./client";
import { mapStayListItem } from "./mappers";

type StayListResponse = {
  stays: ApiStayListItem[];
};

async function fetchStayList(limit: number): Promise<StayListItem[]> {
  const response = await apiFetch<StayListResponse>(`/stays?limit=${limit}&page=1`);
  return response.stays.map(mapStayListItem);
}

export async function getAllStays(): Promise<StayListItem[]> {
  return fetchStayList(100);
}

export async function getFeaturedStay(): Promise<StayListItem | undefined> {
  try {
    const mapped = await fetchStayList(100);
    const featured = mapped.find((item) => item.isFeatured);
    return featured ?? mapped[0];
  } catch {
    return undefined;
  }
}

export async function getSupportingStays(): Promise<StayListItem[]> {
  try {
    const mapped = await fetchStayList(100);
    const featured = mapped.find((item) => item.isFeatured) ?? mapped[0];
    if (!featured) {
      return [];
    }
    return mapped.filter((item) => item.id !== featured.id && !item.isFeatured);
  } catch {
    return [];
  }
}

export async function getStayBySlug(slug: string): Promise<StayListItem | undefined> {
  try {
    const response = await apiFetch<{ stay: ApiStayListItem }>(`/stays/${slug}`);
    return mapStayListItem(response.stay);
  } catch {
    return undefined;
  }
}
