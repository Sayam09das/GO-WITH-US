import type { Metadata } from "next";
import { BookingsContent } from "@/components/account/bookings/bookings-content";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { BOOKINGS_PAGE_COPY } from "@/lib/account/bookings/bookings-copy";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Bookings"),
  description: "View and manage your GO WITH US bookings.",
  path: "/account/bookings",
  noIndex: true,
});

export default function AccountBookingsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <EditorialPageHeader
        eyebrow={BOOKINGS_PAGE_COPY.eyebrow}
        heading={BOOKINGS_PAGE_COPY.heading}
        supporting={BOOKINGS_PAGE_COPY.supporting}
      />
      <BookingsContent />
    </div>
  );
}
