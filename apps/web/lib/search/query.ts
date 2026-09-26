export type SearchCategory = "all" | "destinations" | "stays" | "experiences";

const SEARCH_CATEGORIES: SearchCategory[] = ["all", "destinations", "stays", "experiences"];

export function parseSearchCategory(value: string | null | undefined): SearchCategory {
  if (value && SEARCH_CATEGORIES.includes(value as SearchCategory)) {
    return value as SearchCategory;
  }
  return "all";
}

export function buildSearchPageParams(input: {
  q?: string;
  type?: SearchCategory;
}): URLSearchParams {
  const params = new URLSearchParams();
  const query = input.q?.trim();
  if (query) {
    params.set("q", query);
  }
  if (input.type && input.type !== "all") {
    params.set("type", input.type);
  }
  return params;
}
