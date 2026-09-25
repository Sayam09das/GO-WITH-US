import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { CatalogPageSkeleton } from "@/components/states";
import { searchGlobal } from "@/lib/api/search";
import { buildCatalogTitle, buildPageMetadata, trimDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildCatalogTitle("Search"),
  description: trimDescription(
    "Search destinations, stays, experiences, and travel stories across GO WITH US.",
  ),
  path: "/search",
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchResultsSection({ query }: { query: string }) {
  const results = await searchGlobal(query);
  return <SearchResults query={query} results={results} />;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  return (
    <main>
      <section className="bg-background pb-10 pt-[5.5rem] sm:pb-14 sm:pt-28">
        <div className="container-travel flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Search</p>
          <h1 className="section-heading text-4xl text-heading sm:text-5xl">
            {query ? `Results for “${query}”` : "Search GO WITH US"}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Find destinations, stays, experiences, and editorial stories in one place.
          </p>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel">
          <Suspense fallback={<CatalogPageSkeleton label="Searching catalog…" />}>
            <SearchResultsSection query={query} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
