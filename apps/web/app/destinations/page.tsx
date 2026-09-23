import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsCatalogSection, DestinationsHero } from "@/components/destinations";
import { CatalogPageSkeleton } from "@/components/states";
import { buildCatalogTitle, buildPageMetadata, trimDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildCatalogTitle("Destinations"),
  description: trimDescription(
    "Explore cities, coastlines, mountains, and quieter places worth building a journey around. Discover destinations with GO WITH US.",
  ),
  path: "/destinations",
});

export default function DestinationsPage() {
  return (
    <main>
      <DestinationsHero />
      <Suspense fallback={<CatalogPageSkeleton />}>
        <DestinationsCatalogSection />
      </Suspense>
    </main>
  );
}
