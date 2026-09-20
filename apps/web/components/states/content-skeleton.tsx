import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ContentSkeletonProps {
  className?: string;
  lines?: number;
  showTitle?: boolean;
}

const CONTENT_LINES = [
  { id: "line-1", width: "w-full" },
  { id: "line-2", width: "w-full" },
  { id: "line-3", width: "w-4/5" },
  { id: "line-4", width: "w-3/4" },
] as const;

function ContentSkeleton({ className, lines = 3, showTitle = true }: ContentSkeletonProps) {
  const visibleLines = CONTENT_LINES.slice(0, lines);

  return (
    <div className={cn("flex w-full flex-col gap-3", className)} aria-hidden="true">
      {showTitle ? <Skeleton variant="title" className="max-w-sm" /> : null}
      {visibleLines.map((line) => (
        <Skeleton key={line.id} variant="text" className={line.width} />
      ))}
    </div>
  );
}

export { ContentSkeleton };
