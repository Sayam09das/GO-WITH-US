"use client";

import { MapPinOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo, useRef, useTransition } from "react";
import { DestinationCard } from "@/components/landing/popular-destinations/destination-card";
import { EmptyState } from "@/components/states";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import {
  buildDestinationCatalogSearchParams,
  DESTINATIONS_CATALOG_COPY,
  getDestinationFilterOptions,
  hasActiveDestinationFilters,
  parseDestinationCatalogFilters,
} from "@/lib/destinations";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { DestinationCatalogFilters, DestinationListItem } from "@/types/destination";
import { DestinationsCatalogHeader } from "./destinations-catalog-header";
import { DestinationsCatalogToolbar } from "./destinations-catalog-toolbar";

interface DestinationsCatalogSectionProps {
  initialDestinations: DestinationListItem[];
}

function DestinationsCatalogSection({ initialDestinations }: DestinationsCatalogSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const allDestinations = useMemo(() => initialDestinations, [initialDestinations]);
  const filterOptions = useMemo(
    () => getDestinationFilterOptions(allDestinations),
    [allDestinations],
  );

  const filters = useMemo(() => parseDestinationCatalogFilters(searchParams), [searchParams]);

  const results = useMemo(() => {
    const minRating = filters.rating ? Number.parseFloat(filters.rating) : null;

    const filtered = allDestinations.filter((destination) => {
      if (filters.q) {
        const haystack = [
          destination.title,
          destination.location,
          destination.country,
          destination.region,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(filters.q.toLowerCase())) {
          return false;
        }
      }
      if (filters.region && destination.region !== filters.region) {
        return false;
      }
      if (filters.style && destination.style !== filters.style) {
        return false;
      }
      if (filters.budgetTier && destination.budgetTier !== filters.budgetTier) {
        return false;
      }
      if (minRating !== null && destination.rating < minRating) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }

    return sorted;
  }, [allDestinations, filters]);
  const activeFilters = hasActiveDestinationFilters(filters);

  const updateFilters = useCallback(
    (patch: Partial<DestinationCatalogFilters>) => {
      const next: DestinationCatalogFilters = { ...filters, ...patch };
      const params = buildDestinationCatalogSearchParams(next);
      const query = params.toString();

      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [filters, pathname, router],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.set("[data-dd-card]", { autoAlpha: 0, y: 24 });

      gsap.to("[data-dd-card]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const resultsLabel =
    results.length === 1
      ? `1 ${DESTINATIONS_CATALOG_COPY.resultsSingular}`
      : `${results.length} ${DESTINATIONS_CATALOG_COPY.resultsPlural}`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="destinations-catalog-heading"
      className={cn(
        "travel-section bg-soft-gray",
        reducedMotion && "[&_[data-dd-card]]:opacity-100",
      )}
    >
      <div className="container-travel flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <DestinationsCatalogHeader />

        <DestinationsCatalogToolbar
          filters={filters}
          regions={filterOptions.regions}
          styles={filterOptions.styles}
          hasActiveFilters={activeFilters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {resultsLabel}
          </p>
          {isPending ? (
            <span className="text-xs font-medium text-muted-foreground">Updating results…</span>
          ) : null}
        </div>

        {results.length === 0 && !isPending ? (
          <EmptyState
            title={DESTINATIONS_CATALOG_COPY.emptyTitle}
            description={DESTINATIONS_CATALOG_COPY.emptyDescription}
            icon={MapPinOff}
            action={
              activeFilters
                ? { href: "/destinations", label: DESTINATIONS_CATALOG_COPY.clearFilters }
                : undefined
            }
          />
        ) : (
          <div
            ref={gridRef}
            className={cn(
              "grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6",
              isPending && "opacity-60 transition-opacity duration-200",
            )}
          >
            {results.map((destination, index) => (
              <div key={destination.id} data-dd-card className="h-full will-change-transform">
                <DestinationCard destination={destination} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { DestinationsCatalogSection };
