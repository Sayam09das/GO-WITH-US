import { DestinationsCatalogSection } from "@/components/destinations/catalog/destinations-catalog-section";
import { getAllDestinationsForCatalog } from "@/lib/api/destinations.server";
import { withApiFallback } from "@/lib/api/with-api-fallback";

export async function DestinationsCatalogLoader() {
  const destinations = await withApiFallback(getAllDestinationsForCatalog(), []);
  return <DestinationsCatalogSection initialDestinations={destinations} />;
}
