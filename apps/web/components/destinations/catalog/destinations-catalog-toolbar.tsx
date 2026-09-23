"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DESTINATION_BUDGET_FILTER_OPTIONS,
  DESTINATION_RATING_FILTER_OPTIONS,
  DESTINATION_SORT_OPTIONS,
  DESTINATIONS_CATALOG_COPY,
} from "@/lib/destinations";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { DestinationCatalogFilters } from "@/types/destination";

interface DestinationsCatalogToolbarProps {
  filters: DestinationCatalogFilters;
  regions: string[];
  styles: string[];
  hasActiveFilters: boolean;
  onFilterChange: (patch: Partial<DestinationCatalogFilters>) => void;
  onClearFilters: () => void;
}

function DestinationsCatalogToolbar({
  filters,
  regions,
  styles,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
}: DestinationsCatalogToolbarProps) {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState(filters.q);

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim() !== filters.q) {
        onFilterChange({ q: query.trim() });
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, filters.q, onFilterChange]);

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
          placeholder={DESTINATIONS_CATALOG_COPY.searchPlaceholder}
          aria-label={DESTINATIONS_CATALOG_COPY.searchLabel}
          className="h-11 rounded-xl border-border/80 bg-card pl-10 shadow-xs sm:h-12"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal aria-hidden="true" className="size-4 shrink-0" />
          <span className="sr-only sm:not-sr-only">Filters</span>
        </div>

        <div className="-mx-1 flex flex-1 flex-wrap items-center gap-2 px-1 lg:justify-end">
          <Select
            value={filters.region || "all"}
            onValueChange={(value) => onFilterChange({ region: value === "all" ? "" : value })}
          >
            <SelectTrigger size="sm" className="min-h-9 rounded-full bg-card">
              <SelectValue placeholder={DESTINATIONS_CATALOG_COPY.regionLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{DESTINATIONS_CATALOG_COPY.allOption}</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.style || "all"}
            onValueChange={(value) => onFilterChange({ style: value === "all" ? "" : value })}
          >
            <SelectTrigger size="sm" className="min-h-9 rounded-full bg-card">
              <SelectValue placeholder={DESTINATIONS_CATALOG_COPY.styleLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{DESTINATIONS_CATALOG_COPY.allOption}</SelectItem>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.budgetTier || "all"}
            onValueChange={(value) => onFilterChange({ budgetTier: value === "all" ? "" : value })}
          >
            <SelectTrigger size="sm" className="min-h-9 rounded-full bg-card">
              <SelectValue placeholder={DESTINATIONS_CATALOG_COPY.budgetLabel} />
            </SelectTrigger>
            <SelectContent>
              {DESTINATION_BUDGET_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value || "all"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.rating || "all"}
            onValueChange={(value) => onFilterChange({ rating: value === "all" ? "" : value })}
          >
            <SelectTrigger size="sm" className="min-h-9 rounded-full bg-card">
              <SelectValue placeholder={DESTINATIONS_CATALOG_COPY.ratingLabel} />
            </SelectTrigger>
            <SelectContent>
              {DESTINATION_RATING_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value || "all"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sort}
            onValueChange={(value) =>
              onFilterChange({ sort: value as DestinationCatalogFilters["sort"] })
            }
          >
            <SelectTrigger size="sm" className="min-h-9 rounded-full bg-card">
              <SelectValue placeholder={DESTINATIONS_CATALOG_COPY.sortLabel} />
            </SelectTrigger>
            <SelectContent>
              {DESTINATION_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters ? (
            <motion.button
              type="button"
              onClick={onClearFilters}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border border-border/80 bg-card px-3.5 text-sm font-medium text-heading transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              )}
            >
              {DESTINATIONS_CATALOG_COPY.clearFilters}
            </motion.button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { DestinationsCatalogToolbar };
