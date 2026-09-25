import { getAllDestinations } from "@/lib/api/destinations";
import { getAllExperiences } from "@/lib/api/experiences";
import { getAllStays } from "@/lib/api/stays";

export async function getDestinationSlugs(): Promise<string[]> {
  try {
    const destinations = await getAllDestinations();
    return destinations.map((destination) => destination.slug);
  } catch {
    return [];
  }
}

export async function getStaySlugs(): Promise<string[]> {
  try {
    const stays = await getAllStays();
    return stays.map((stay) => stay.slug);
  } catch {
    return [];
  }
}

export async function getExperienceSlugs(): Promise<string[]> {
  try {
    const experiences = await getAllExperiences();
    return experiences.map((experience) => experience.slug);
  } catch {
    return [];
  }
}
