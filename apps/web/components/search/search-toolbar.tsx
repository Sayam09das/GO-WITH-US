"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildSearchPageParams,
  parseSearchCategory,
  SEARCH_PAGE_COPY,
  type SearchCategory,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const TAB_ORDER: SearchCategory[] = ["all", "destinations", "stays", "experiences"];

interface SearchToolbarProps {
  initialQuery: string;
}

function SearchToolbar({ initialQuery }: SearchToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const activeCategory = parseSearchCategory(searchParams.get("type"));

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed === initialQuery.trim()) {
        return;
      }

      startTransition(() => {
        const params = buildSearchPageParams({ q: trimmed, type: activeCategory });
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, initialQuery, activeCategory, pathname, router]);

  const setCategory = (type: SearchCategory) => {
    startTransition(() => {
      const params = buildSearchPageParams({ q: query.trim(), type });
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    });
  };

  const clearSearch = () => {
    setQuery("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          placeholder={SEARCH_PAGE_COPY.searchPlaceholder}
          aria-label={SEARCH_PAGE_COPY.searchLabel}
          className="h-11 rounded-xl border-border/80 bg-card pl-10 pr-11 shadow-xs sm:h-12"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query.trim().length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground"
            onClick={clearSearch}
            aria-label={SEARCH_PAGE_COPY.clearSearch}
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter search results by category"
          className="flex flex-wrap gap-2"
        >
          {TAB_ORDER.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/80 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                )}
                onClick={() => setCategory(tab)}
              >
                {SEARCH_PAGE_COPY.tabs[tab]}
              </button>
            );
          })}
        </div>

        {isPending ? (
          <p className="text-xs font-medium text-muted-foreground">{SEARCH_PAGE_COPY.updating}</p>
        ) : null}
      </div>
    </div>
  );
}

export { SearchToolbar };
