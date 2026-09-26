import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { ItinerariesContent } from "@/components/account/itineraries/itineraries-content";
import { Button } from "@/components/ui/button";
import { ITINERARIES_PAGE_COPY } from "@/lib/account/itineraries/itineraries-copy";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Itineraries"),
  description: "View and manage your day-by-day trip itineraries on GO WITH US.",
  path: "/account/itineraries",
  noIndex: true,
});

export default function AccountItinerariesPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <EditorialPageHeader
        eyebrow={ITINERARIES_PAGE_COPY.eyebrow}
        heading={ITINERARIES_PAGE_COPY.heading}
        supporting={ITINERARIES_PAGE_COPY.supporting}
        action={
          <Button asChild className="w-full rounded-full px-5 sm:w-auto">
            <Link href={ITINERARIES_PAGE_COPY.createHref}>
              <Plus aria-hidden="true" className="size-4" />
              {ITINERARIES_PAGE_COPY.create}
            </Link>
          </Button>
        }
      />
      <ItinerariesContent />
    </div>
  );
}
