import { Skeleton } from "@/components/ui/skeleton";
import { LOADING_COPY } from "@/lib/states";
import { ImageSkeleton } from "./image-skeleton";

interface CatalogPageSkeletonProps {
  label?: string;
}

function CatalogPageSkeleton({ label = LOADING_COPY.catalog }: CatalogPageSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="container-travel animate-in fade-in duration-300 motion-reduce:animate-none py-10 sm:py-14"
    >
      <span className="sr-only">{label}</span>

      <div className="flex flex-col gap-8">
        <header className="flex max-w-2xl flex-col gap-4">
          <Skeleton className="h-3 w-28 rounded-full" aria-hidden="true" />
          <Skeleton variant="title" className="h-10 max-w-sm sm:h-11" aria-hidden="true" />
          <Skeleton variant="caption" className="max-w-md" aria-hidden="true" />
        </header>

        <Skeleton variant="block" className="h-12 rounded-xl" aria-hidden="true" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(["a", "b", "c", "d", "e", "f"] as const).map((slot) => (
            <article key={`catalog-card-${slot}`} className="flex flex-col gap-3">
              <ImageSkeleton aspectRatio="aspect-[4/3]" className="rounded-2xl" />
              <Skeleton variant="text" className="w-3/4" aria-hidden="true" />
              <Skeleton variant="caption" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export { CatalogPageSkeleton };
