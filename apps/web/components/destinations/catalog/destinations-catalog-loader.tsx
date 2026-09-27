import { DestinationsCatalogSection } from "@/components/destinations/catalog/destinations-catalog-section";
import { CatalogLoadError } from "@/components/states/catalog-load-error";
import { getAllDestinationsForCatalog } from "@/lib/api/destinations.server";
import { tryApiLoad } from "@/lib/api/with-api-fallback";

export async function DestinationsCatalogLoader() {
  const loaded = await tryApiLoad(getAllDestinationsForCatalog());
  if (!loaded.ok) {
    return <CatalogLoadError />;
  }
  return <DestinationsCatalogSection initialDestinations={loaded.value} />;
}
