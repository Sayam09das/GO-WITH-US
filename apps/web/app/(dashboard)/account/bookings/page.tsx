import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { BookingsList } from "@/components/account/bookings/bookings-list";
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
      <AccountPageHeader
        title="Bookings"
        description="Track pending and confirmed reservations for stays and experiences."
      />
      <BookingsList />
    </div>
  );
}
