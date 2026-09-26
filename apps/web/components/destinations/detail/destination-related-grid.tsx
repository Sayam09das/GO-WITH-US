"use client";

import { DestinationCard } from "@/components/landing/popular-destinations/destination-card";
import type { DestinationDetailResponse } from "@/lib/api/destinations";
import { mapDestinationListItem } from "@/lib/api/mappers";

interface DestinationRelatedGridProps {
  related: DestinationDetailResponse["relatedDestinations"];
}

function DestinationRelatedGrid({ related }: DestinationRelatedGridProps) {
  if (related.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((item, index) => (
        <DestinationCard key={item.id} destination={mapDestinationListItem(item)} index={index} />
      ))}
    </div>
  );
}

export { DestinationRelatedGrid };
