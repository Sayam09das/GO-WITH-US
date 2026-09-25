import { DestinationsCatalogSection } from "@/components/destinations/catalog/destinations-catalog-section";
import { getAllDestinations } from "@/lib/api/destinations";

export async function DestinationsCatalogLoader() {
  const destinations = await getAllDestinations();
  return <DestinationsCatalogSection initialDestinations={destinations} />;
}
