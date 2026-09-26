import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { EmptyState } from "@/components/states";
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
      <AccountPageHeader
        title="Travel documents"
        description="Confirmations, tickets, and receipts in one calm place when you need them."
      />
      <section className="max-w-lg rounded-[1.25rem] border border-border/60 bg-background p-8 shadow-sm">
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="When you confirm bookings, PDFs and reference numbers will show up here for easy access."
          action={{ href: "/account/bookings", label: "View bookings" }}
          secondaryAction={{ href: "/trips", label: "Plan a trip" }}
        />
      </section>
    </div>
  );
}
