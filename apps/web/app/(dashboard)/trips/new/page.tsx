import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { CreateTripForm } from "@/components/account/trips/create-trip-form";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

type NewTripPageProps = {
  searchParams: Promise<{
    destinationId?: string;
    title?: string;
    destination?: string;
  }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Plan a trip"),
  description: "Start a new trip on GO WITH US.",
  path: "/trips/new",
  noIndex: true,
});

export default async function NewTripPage({ searchParams }: NewTripPageProps) {
  const params = await searchParams;
  const defaultTitle = params.title?.trim() || undefined;
  const destinationId = params.destinationId?.trim() || undefined;
  const destinationLabel = params.destination?.trim() || undefined;

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Plan a trip"
        description="Name your journey, set dates, and we'll add it to My trips — ready for day-by-day planning."
      />
      <CreateTripForm
        defaultTitle={defaultTitle}
        destinationId={destinationId}
        destinationLabel={destinationLabel}
      />
    </div>
  );
}
