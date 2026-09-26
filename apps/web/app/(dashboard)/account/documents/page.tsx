import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { DocumentsContent } from "@/components/account/documents/documents-content";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { Button } from "@/components/ui/button";
import { DOCUMENTS_PAGE_COPY } from "@/lib/account/documents/documents-copy";
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
      <EditorialPageHeader
        eyebrow={DOCUMENTS_PAGE_COPY.eyebrow}
        heading={DOCUMENTS_PAGE_COPY.heading}
        supporting={DOCUMENTS_PAGE_COPY.supporting}
        action={
          <Button type="button" className="w-full rounded-full px-5 sm:w-auto" disabled>
            <Plus aria-hidden="true" className="size-4" />
            {DOCUMENTS_PAGE_COPY.addDocument}
          </Button>
        }
      />
      <DocumentsContent />
    </div>
  );
}
