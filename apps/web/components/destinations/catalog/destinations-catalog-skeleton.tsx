import { ImageSkeleton } from "@/components/states/image-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { LOADING_COPY } from "@/lib/states";

const GRID_SKELETON_SLOTS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;

interface DestinationsCatalogSkeletonProps {
  label?: string;
}

function DestinationsCatalogSkeleton({
  label = LOADING_COPY.catalog,
}: DestinationsCatalogSkeletonProps) {
  return (
    <section
      aria-busy="true"
      aria-labelledby="destinations-catalog-heading"
      className="travel-section bg-soft-gray"
    >
      <div className="container-travel flex flex-col gap-8 sm:gap-10 lg:gap-12">
        <span className="sr-only">{label}</span>

        <header className="flex max-w-2xl flex-col gap-3 sm:gap-4">
          <Skeleton className="h-3 w-20 rounded-full" aria-hidden="true" />
          <Skeleton
            id="destinations-catalog-heading"
            variant="title"
            className="h-9 max-w-md sm:h-10 lg:h-11"
            aria-hidden="true"
          />
          <Skeleton variant="caption" className="max-w-lg" aria-hidden="true" />
        </header>

        <div className="flex flex-col gap-4 sm:gap-5">
          <Skeleton variant="block" className="h-11 rounded-xl sm:h-12" aria-hidden="true" />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-4 w-16 rounded-full" aria-hidden="true" />
            <div className="flex flex-wrap gap-2">
              {(["r", "s", "b", "t", "o"] as const).map((slot) => (
                <Skeleton
                  key={`destinations-filter-${slot}`}
                  className="h-9 w-[5.5rem] rounded-full sm:w-28"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        <Skeleton className="h-4 w-32 rounded-full" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {GRID_SKELETON_SLOTS.map((slot) => (
            <article
              key={`destinations-catalog-card-${slot}`}
              className="rounded-[1.25rem] bg-card p-3 shadow-sm sm:rounded-[1.375rem] sm:p-3.5"
            >
              <ImageSkeleton
                aspectRatio="aspect-[4/3]"
                className="rounded-xl sm:rounded-[0.875rem]"
              />
              <div className="flex items-start justify-between gap-3 px-0.5 pb-1 pt-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton variant="text" className="h-5 w-4/5" aria-hidden="true" />
                  <Skeleton variant="caption" className="h-4 w-2/3" aria-hidden="true" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-full" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { DestinationsCatalogSkeleton };
