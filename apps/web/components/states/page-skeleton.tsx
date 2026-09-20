import { Skeleton } from "@/components/ui/skeleton";
import { LOADING_COPY } from "@/lib/states";
import { ContentSkeleton } from "./content-skeleton";
import { ImageSkeleton } from "./image-skeleton";

interface PageSkeletonProps {
  label?: string;
}

function PageSkeleton({ label = LOADING_COPY.default }: PageSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="container-travel animate-in fade-in duration-300 motion-reduce:animate-none py-10 sm:py-14"
    >
      <span className="sr-only">{label}</span>

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24 rounded-full" aria-hidden="true" />
          <Skeleton variant="title" className="h-10 max-w-md sm:h-12" aria-hidden="true" />
          <Skeleton variant="caption" className="max-w-sm" aria-hidden="true" />
        </div>

        <Skeleton variant="block" className="h-14 rounded-2xl" aria-hidden="true" />

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageSkeleton aspectRatio="aspect-[5/4]" />
          <ImageSkeleton aspectRatio="aspect-[5/4]" />
        </div>

        <ContentSkeleton lines={2} />
      </div>
    </div>
  );
}

export { PageSkeleton };
