import type { Metadata } from "next";
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
      <div className="mb-8 max-w-2xl">
        <h1 className="section-heading text-3xl text-heading sm:text-4xl">Bookings</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Track pending and confirmed reservations for stays and experiences.
        </p>
      </div>
      <BookingsList />
    </div>
  );
}
