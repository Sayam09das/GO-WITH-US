import type { Metadata } from "next";
import { Suspense } from "react";
import { ExperiencesCatalogGrid } from "@/components/catalog/experiences-catalog-grid";
import { CatalogPageSkeleton } from "@/components/states";
import { buildCatalogTitle, buildPageMetadata, trimDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildCatalogTitle("Experiences"),
  description: trimDescription(
    "Discover experiences and activities worth adding to your journey — tours, outdoor adventures, culture, and food curated by GO WITH US.",
  ),
  path: "/experiences",
});

export default function ExperiencesPage() {
  return (
    <main>
      <section className="bg-background pb-10 pt-[5.5rem] sm:pb-14 sm:pt-28">
        <div className="container-travel flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Experiences
          </p>
          <h1 className="section-heading text-4xl text-heading sm:text-5xl">
            Discover experiences &amp; activities
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Curated ways to spend your days — from sailing coastlines to cooking with locals.
          </p>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel">
          <Suspense fallback={<CatalogPageSkeleton />}>
            <ExperiencesCatalogGrid />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
