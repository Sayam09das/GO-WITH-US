import type { Metadata } from "next";
import { StayCatalogCard } from "@/components/catalog/stay-catalog-card";
import { getAllStays } from "@/lib/api/stays";
import { buildCatalogTitle, buildPageMetadata, trimDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildCatalogTitle("Stays"),
  description: trimDescription(
    "Find unique stays worth building a journey around — boutique hotels, villas, lodges, and apartments curated by GO WITH US.",
  ),
  path: "/stays",
});

export default async function StaysPage() {
  const stays = await getAllStays();

  return (
    <main>
      <section className="bg-background pb-10 pt-[5.5rem] sm:pb-14 sm:pt-28">
        <div className="container-travel flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Stays</p>
          <h1 className="section-heading text-4xl text-heading sm:text-5xl">Find unique stays</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Browse curated places to stay — from cliffside villas to quiet city apartments — without
            the noise of a booking marketplace.
          </p>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay) => (
              <StayCatalogCard key={stay.id} stay={stay} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
