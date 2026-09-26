import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { SavedCollectionContent } from "@/components/account/saved/saved-collection-content";
import { Button } from "@/components/ui/button";
import { SAVED_PAGE_COPY } from "@/lib/account/saved/saved-page-copy";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Saved"),
  description: "Your saved destinations, stays, and experiences on GO WITH US.",
  path: "/saved",
  noIndex: true,
});

export default function SavedPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <EditorialPageHeader
        eyebrow={SAVED_PAGE_COPY.eyebrow}
        heading={SAVED_PAGE_COPY.heading}
        supporting={SAVED_PAGE_COPY.supporting}
        action={
          <Button asChild variant="outline" className="w-full rounded-full px-5 sm:w-auto">
            <Link href={SAVED_PAGE_COPY.exploreHref}>
              {SAVED_PAGE_COPY.explore}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        }
      />
      <SavedCollectionContent />
    </div>
  );
}
