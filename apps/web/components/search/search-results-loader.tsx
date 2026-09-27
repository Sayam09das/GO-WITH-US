import { CatalogLoadError } from "@/components/states/catalog-load-error";
import { searchGlobal } from "@/lib/api/search";
import { tryApiLoad } from "@/lib/api/with-api-fallback";
import { SearchResultsPanel } from "./search-results-panel";

interface SearchResultsLoaderProps {
  query: string;
}

async function SearchResultsLoader({ query }: SearchResultsLoaderProps) {
  const loaded = await tryApiLoad(searchGlobal(query, 12));

  if (!loaded.ok) {
    return (
      <CatalogLoadError
        title="Search unavailable"
        description="We could not load search results. Try again in a moment."
      />
    );
  }

  return <SearchResultsPanel query={query} results={loaded.value} />;
}

export { SearchResultsLoader };
