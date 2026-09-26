import { DestinationsCatalogSection } from "@/components/destinations/catalog/destinations-catalog-section";
import { getAllDestinations } from "@/lib/api/destinations";
import { withApiFallback } from "@/lib/api/with-api-fallback";

export async function DestinationsCatalogLoader() {
  const destinations = await withApiFallback(getAllDestinations(), []);
  return <DestinationsCatalogSection initialDestinations={destinations} />;
}
