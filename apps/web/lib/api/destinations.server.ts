import "server-only";

import type { DestinationDetailResponse } from "./destinations";
import { getAllDestinations } from "./destinations";
import { serverApiFetch } from "./server";

export async function getAllDestinationsForCatalog() {
  return getAllDestinations(serverApiFetch);
}

export async function getDestinationBySlugForPage(
  slug: string,
): Promise<DestinationDetailResponse | null> {
  try {
    const response = await serverApiFetch<{ destination: DestinationDetailResponse }>(
      `/destinations/${slug}`,
    );
    return response.destination;
  } catch {
    return null;
  }
}
