import type { StayListItem as ApiStayListItem } from "@gowithus/types";
import { STAYS_FIXTURE } from "@/data/fixtures/loaders/stays";
import type { StayListItem } from "@/types/stay";
import { apiFetch } from "./client";
import { mapStayListItem } from "./mappers";

type StayListResponse = {
  stays: ApiStayListItem[];
};

export async function getAllStays(): Promise<StayListItem[]> {
  try {
    const response = await apiFetch<StayListResponse>("/stays?limit=100&page=1");
    return response.stays.map(mapStayListItem);
  } catch {
    return STAYS_FIXTURE;
  }
}

export async function getFeaturedStay(): Promise<StayListItem | undefined> {
  try {
    const response = await apiFetch<StayListResponse>("/stays?limit=12&page=1");
    const mapped = response.stays.map(mapStayListItem);
    const featured = mapped.find((item) => item.isFeatured);
    const fallback = mapped[0];
    return featured ?? fallback;
  } catch {
    return STAYS_FIXTURE.find((item) => item.isFeatured);
  }
}

export async function getSupportingStays(): Promise<StayListItem[]> {
  try {
    const response = await apiFetch<StayListResponse>("/stays?limit=12&page=1");
    return response.stays.map(mapStayListItem).filter((item) => !item.isFeatured);
  } catch {
    return STAYS_FIXTURE.filter((item) => !item.isFeatured);
  }
}

export async function getStayBySlug(slug: string): Promise<StayListItem | undefined> {
  try {
    const response = await apiFetch<{ stay: ApiStayListItem }>(`/stays/${slug}`);
    return mapStayListItem(response.stay);
  } catch {
    return STAYS_FIXTURE.find((item) => item.slug === slug);
  }
}
