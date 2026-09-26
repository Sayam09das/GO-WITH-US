import { MY_TRIPS_SECTION_COPY } from "@/lib/account/trips/my-trips-copy";
import type { TripIncludesCounts } from "@/lib/account/trips/trip-display";
import { cn } from "@/lib/utils";

interface TripIncludesPreviewProps {
  counts: TripIncludesCounts;
  className?: string;
}

function countForKey(counts: TripIncludesCounts, key: string): number {
  if (key === "stay") return counts.stay;
  if (key === "experience") return counts.experience;
  if (key === "restaurant") return counts.restaurant;
  return counts.places;
}

function TripIncludesPreview({ counts, className }: TripIncludesPreviewProps) {
  const total = counts.stay + counts.experience + counts.restaurant + counts.places;

  return (
    <section
      aria-labelledby="trip-includes-heading"
      className={cn(
        "rounded-[1.25rem] border border-border/60 bg-muted/30 px-5 py-6 sm:px-6 sm:py-7",
        className,
      )}
    >
      <h3 id="trip-includes-heading" className="text-sm font-semibold text-heading sm:text-base">
        {MY_TRIPS_SECTION_COPY.includesHeading}
      </h3>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MY_TRIPS_SECTION_COPY.includesCategories.map((category) => {
          const value = countForKey(counts, category.key);
          const hasItems = value > 0;

          return (
            <li
              key={category.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/80 px-4 py-3"
            >
              <span className="text-sm text-heading">{category.label}</span>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  hasItems ? "text-primary" : "text-muted-foreground",
                )}
              >
                {hasItems ? value : total === 0 ? "Not yet" : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { TripIncludesPreview };
