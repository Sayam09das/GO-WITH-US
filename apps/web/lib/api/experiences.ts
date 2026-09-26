import type { ExperienceListItem as ApiExperienceListItem } from "@gowithus/types";
import type { ExperienceListItem } from "@/types/experience";
import { apiFetch } from "./client";
import { mapExperienceListItem } from "./mappers";

type ExperienceListResponse = {
  experiences: ApiExperienceListItem[];
};

function orderFeaturedExperiences(items: ExperienceListItem[]): ExperienceListItem[] {
  const featured = items.find((item) => item.isFeatured);
  const supporting = items.filter((item) => !item.isFeatured);

  if (!featured) {
    return items.slice(0, 4);
  }

  return [featured, ...supporting].slice(0, 4);
}

async function fetchExperienceList(limit: number): Promise<ExperienceListItem[]> {
  const response = await apiFetch<ExperienceListResponse>(`/experiences?limit=${limit}&page=1`);
  return response.experiences.map(mapExperienceListItem);
}

export async function getAllExperiences(): Promise<ExperienceListItem[]> {
  return fetchExperienceList(100);
}

export async function getFeaturedExperiences(): Promise<ExperienceListItem[]> {
  try {
    const response = await apiFetch<ExperienceListResponse>("/experiences/featured");
    const mapped = response.experiences.map(mapExperienceListItem);
    if (mapped.length > 0) {
      return orderFeaturedExperiences(mapped);
    }
  } catch {
    // Fall through to catalog list.
  }

  try {
    const listed = await fetchExperienceList(12);
    return orderFeaturedExperiences(listed);
  } catch {
    return [];
  }
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceListItem | undefined> {
  try {
    const response = await apiFetch<{ experience: ApiExperienceListItem }>(`/experiences/${slug}`);
    return mapExperienceListItem(response.experience);
  } catch {
    return undefined;
  }
}
