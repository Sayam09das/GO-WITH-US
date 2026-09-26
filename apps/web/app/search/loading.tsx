import { SearchResultsSkeleton } from "@/components/search";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <main>
      <section className="travel-section bg-soft-gray pt-[5.5rem] sm:pt-28">
        <div className="container-travel flex flex-col gap-8 sm:gap-10 lg:gap-12">
          <header className="flex max-w-2xl flex-col gap-3 sm:gap-4">
            <Skeleton className="h-3 w-16 rounded-full" aria-hidden="true" />
            <Skeleton variant="title" className="h-9 max-w-md sm:h-10" aria-hidden="true" />
            <Skeleton variant="caption" className="max-w-lg" aria-hidden="true" />
          </header>
          <Skeleton variant="block" className="h-11 rounded-xl sm:h-12" aria-hidden="true" />
          <SearchResultsSkeleton />
        </div>
      </section>
    </main>
  );
}
