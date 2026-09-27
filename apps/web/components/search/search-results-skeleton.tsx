import { ImageSkeleton } from "@/components/states/image-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { LOADING_COPY } from "@/lib/states";

const GRID_SLOTS = ["a", "b", "c", "d", "e", "f"] as const;

function SearchResultsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-8 motion-reduce:animate-none"
    >
      <span className="sr-only">{LOADING_COPY.catalog}</span>
      <Skeleton className="h-4 w-24 rounded-full" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {GRID_SLOTS.map((slot) => (
          <article
            key={`search-result-${slot}`}
            className="rounded-[1.25rem] bg-card p-3 shadow-sm sm:rounded-[1.375rem] sm:p-3.5"
          >
            <ImageSkeleton
              aspectRatio="aspect-[4/3]"
              className="rounded-xl sm:rounded-[0.875rem]"
            />
            <div className="space-y-2 px-0.5 pb-1 pt-4">
              <Skeleton variant="text" className="h-5 w-4/5" aria-hidden="true" />
              <Skeleton variant="caption" className="h-4 w-2/3" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export { SearchResultsSkeleton };
