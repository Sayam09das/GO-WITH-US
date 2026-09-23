import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Travel Documents"),
  description: "Tickets, confirmations, and invoices for your GO WITH US trips.",
  path: "/account/documents",
  noIndex: true,
});

export default function AccountDocumentsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Travel documents and confirmations will be stored here for easy access.
      </p>
    </div>
  );
}
