import type { Metadata } from "next";
import { DocumentsPageShell } from "@/components/account/documents/documents-page-shell";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Travel Documents"),
  description: "Tickets, confirmations, and invoices for your GO WITH US trips.",
  path: "/account/documents",
  noIndex: true,
});

export default function AccountDocumentsPage() {
  return <DocumentsPageShell />;
}
