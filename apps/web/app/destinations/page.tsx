import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsHero } from "@/components/destinations";
import { DestinationsCatalogSkeleton } from "@/components/destinations/catalog";
import { DestinationsCatalogLoader } from "@/components/destinations/catalog/destinations-catalog-loader";
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
      <Suspense fallback={<DestinationsCatalogSkeleton label="Loading destinations…" />}>
        <DestinationsCatalogLoader />
      </Suspense>
    </main>
  );
}
