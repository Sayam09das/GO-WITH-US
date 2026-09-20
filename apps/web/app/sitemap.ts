import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  getDestinationSlugs,
  getExperienceSlugs,
  getStaySlugs,
  STATIC_INDEXABLE_PATHS,
} from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinationSlugs, staySlugs, experienceSlugs] = await Promise.all([
    getDestinationSlugs(),
    getStaySlugs(),
    getExperienceSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_INDEXABLE_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "weekly",
    priority: path === "/" ? 1 : 0.9,
  }));

  const destinationEntries: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: absoluteUrl(`/destinations/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const stayEntries: MetadataRoute.Sitemap = staySlugs.map((slug) => ({
    url: absoluteUrl(`/stays/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const experienceEntries: MetadataRoute.Sitemap = experienceSlugs.map((slug) => ({
    url: absoluteUrl(`/experiences/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...destinationEntries, ...stayEntries, ...experienceEntries];
}
