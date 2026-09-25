import type { ExperienceListItem as ApiExperienceListItem } from "@gowithus/types";
import { EXPERIENCES_FIXTURE } from "@/data/fixtures/loaders/experiences";
import type { ExperienceListItem } from "@/types/experience";
import { apiFetch } from "./client";
import { mapExperienceListItem } from "./mappers";

type ExperienceListResponse = {
  experiences: ApiExperienceListItem[];
};

export async function getAllExperiences(): Promise<ExperienceListItem[]> {
  try {
    const response = await apiFetch<ExperienceListResponse>("/experiences?limit=100&page=1");
    return response.experiences.map(mapExperienceListItem);
  } catch {
    return EXPERIENCES_FIXTURE;
  }
}

export async function getFeaturedExperiences(): Promise<ExperienceListItem[]> {
  try {
    const response = await apiFetch<ExperienceListResponse>("/experiences/featured");
    const mapped = response.experiences.map(mapExperienceListItem);
    const featured = mapped.find((item) => item.isFeatured);
    const supporting = mapped.filter((item) => !item.isFeatured);

    if (!featured) {
      return mapped.slice(0, 4);
    }

    return [featured, ...supporting];
  } catch {
    const featured = EXPERIENCES_FIXTURE.find((item) => item.isFeatured);
    const supporting = EXPERIENCES_FIXTURE.filter((item) => !item.isFeatured);
    return featured ? [featured, ...supporting] : EXPERIENCES_FIXTURE.slice(0, 4);
  }
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceListItem | undefined> {
  try {
    const response = await apiFetch<{ experience: ApiExperienceListItem }>(`/experiences/${slug}`);
    return mapExperienceListItem(response.experience);
  } catch {
    return EXPERIENCES_FIXTURE.find((item) => item.slug === slug);
  }
}
