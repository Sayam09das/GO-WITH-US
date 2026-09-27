import { DestinationsHero } from "@/components/destinations";
import { DestinationsCatalogSkeleton } from "@/components/destinations/catalog";

export default function DestinationsLoading() {
  return (
    <main>
      <DestinationsHero />
      <DestinationsCatalogSkeleton label="Loading destinations…" />
    </main>
  );
}
