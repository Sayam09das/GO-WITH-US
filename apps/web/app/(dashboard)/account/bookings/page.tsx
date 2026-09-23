import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Bookings will appear here once reservation features are available.
      </p>
    </div>
  );
}
