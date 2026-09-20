import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: string;
}

function ImageSkeleton({ className, aspectRatio = "aspect-[4/3]" }: ImageSkeletonProps) {
  return (
    <Skeleton
      variant="image"
      className={cn(aspectRatio, "rounded-xl", className)}
      aria-hidden="true"
    />
  );
}

export { ImageSkeleton };
