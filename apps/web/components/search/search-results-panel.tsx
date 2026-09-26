"use client";

import { MapPin, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { StayCatalogCard } from "@/components/catalog/stay-catalog-card";
import { ExperienceCard } from "@/components/landing/featured-experiences/experience-card";
import { DestinationCard } from "@/components/landing/popular-destinations/destination-card";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import type { GlobalSearchResults } from "@/lib/api/search";
import { parseSearchCategory, SEARCH_PAGE_COPY, type SearchCategory } from "@/lib/search";

type SearchResultsPanelProps = {
  query: string;
  results: GlobalSearchResults;
};

function countForCategory(results: GlobalSearchResults, category: SearchCategory): number {
  switch (category) {
    case "destinations":
      return results.destinations.length;
    case "stays":
      return results.stays.length;
    case "experiences":
      return results.experiences.length;
    default:
      return (
        results.destinations.length +
        results.stays.length +
        results.experiences.length +
        results.stories.length
      );
  }
}

function SearchResultsPanel({ query, results }: SearchResultsPanelProps) {
  const searchParams = useSearchParams();
  const category = parseSearchCategory(searchParams.get("type"));

  const trimmedQuery = query.trim();
  const total = useMemo(() => countForCategory(results, category), [results, category]);

  const showDestinations = category === "all" || category === "destinations";
  const showStays = category === "all" || category === "stays";
  const showExperiences = category === "all" || category === "experiences";
  const showStories = category === "all";

  if (!trimmedQuery) {
    return (
      <EmptyState
        title={SEARCH_PAGE_COPY.emptyQueryTitle}
        description={SEARCH_PAGE_COPY.emptyQueryDescription}
        icon={SearchX}
      />
    );
  }

  if (total === 0) {
    return (
      <EmptyState
        title={SEARCH_PAGE_COPY.emptyResultsTitle(trimmedQuery)}
        description={SEARCH_PAGE_COPY.emptyResultsDescription}
        icon={SearchX}
        action={{ href: "/search", label: SEARCH_PAGE_COPY.clearSearch }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {SEARCH_PAGE_COPY.resultsCount(total)}
      </p>

      {showDestinations && results.destinations.length > 0 ? (
        <section aria-labelledby="search-destinations-heading" className="flex flex-col gap-5">
          <h2
            id="search-destinations-heading"
            className="section-heading text-xl text-heading sm:text-2xl"
          >
            {SEARCH_PAGE_COPY.sections.destinations}
          </h2>
          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.destinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {showStays && results.stays.length > 0 ? (
        <section aria-labelledby="search-stays-heading" className="flex flex-col gap-5">
          <h2
            id="search-stays-heading"
            className="section-heading text-xl text-heading sm:text-2xl"
          >
            {SEARCH_PAGE_COPY.sections.stays}
          </h2>
          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.stays.map((stay) => (
              <StayCatalogCard key={stay.id} stay={stay} />
            ))}
          </div>
        </section>
      ) : null}

      {showExperiences && results.experiences.length > 0 ? (
        <section aria-labelledby="search-experiences-heading" className="flex flex-col gap-5">
          <h2
            id="search-experiences-heading"
            className="section-heading text-xl text-heading sm:text-2xl"
          >
            {SEARCH_PAGE_COPY.sections.experiences}
          </h2>
          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.experiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {showStories && results.stories.length > 0 ? (
        <section aria-labelledby="search-stories-heading" className="flex flex-col gap-5">
          <h2
            id="search-stories-heading"
            className="section-heading text-xl text-heading sm:text-2xl"
          >
            {SEARCH_PAGE_COPY.sections.stories}
          </h2>
          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/inspiration/${story.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <div className="relative aspect-[16/10] bg-soft-gray">
                    <Image
                      src={story.heroImage}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2 p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {story.categoryLabel}
                    </p>
                    <h3 className="text-lg font-semibold text-heading transition-colors group-hover:text-primary">
                      {story.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {story.excerpt}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3 shrink-0 text-primary" />
                      {story.destination}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {category !== "all" && total > 0 ? (
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/search?q=${encodeURIComponent(trimmedQuery)}`}>
              {SEARCH_PAGE_COPY.tabs.all}
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { SearchResultsPanel };
