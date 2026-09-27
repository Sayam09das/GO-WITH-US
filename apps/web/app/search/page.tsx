import type { Metadata } from "next";
import { Suspense } from "react";
import {
  SearchHeader,
  SearchResultsLoader,
  SearchResultsSkeleton,
  SearchToolbar,
} from "@/components/search";
import { Skeleton } from "@/components/ui/skeleton";
import { buildCatalogTitle, buildPageMetadata, trimDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildCatalogTitle("Search"),
  description: trimDescription(
    "Search destinations, stays, experiences, and travel stories across GO WITH US.",
  ),
  path: "/search",
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  return (
    <main>
      <section
        aria-labelledby="search-page-heading"
        className="travel-section bg-soft-gray pt-[5.5rem] sm:pt-28"
      >
        <div className="container-travel flex flex-col gap-8 sm:gap-10 lg:gap-12">
          <SearchHeader query={query} />
          <Suspense
            fallback={
              <Skeleton variant="block" className="h-11 rounded-xl sm:h-12" aria-hidden="true" />
            }
          >
            <SearchToolbar initialQuery={query} />
          </Suspense>
          <Suspense fallback={<SearchResultsSkeleton />} key={query}>
            <SearchResultsLoader query={query} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
