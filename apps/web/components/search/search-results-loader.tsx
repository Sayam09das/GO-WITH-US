import { searchGlobal } from "@/lib/api/search";
import { withApiFallback } from "@/lib/api/with-api-fallback";
import { SearchResultsPanel } from "./search-results-panel";

interface SearchResultsLoaderProps {
  query: string;
}

async function SearchResultsLoader({ query }: SearchResultsLoaderProps) {
  const results = await withApiFallback(searchGlobal(query, 12), {
    destinations: [],
    stays: [],
    experiences: [],
    stories: [],
  });

  return <SearchResultsPanel query={query} results={results} />;
}

export { SearchResultsLoader };
