"use client";

import { Download, FileText, LoaderCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import {
  DOCUMENTS_BOTTOM_CTA,
  DOCUMENTS_EMPTY_COPY,
  DOCUMENTS_PAGE_COPY,
  DOCUMENTS_TABS,
  type DocumentsTabId,
  TRAVEL_DOCUMENTS_FIXTURE,
  type TravelDocumentItem,
} from "@/lib/account/documents/documents-copy";

function filterDocuments(items: TravelDocumentItem[], tab: DocumentsTabId): TravelDocumentItem[] {
  if (tab === "all") {
    return items;
  }
  return items.filter((item) => item.category === tab);
}

function DocumentsContent() {
  const [activeTab, setActiveTab] = useState<DocumentsTabId>("all");
  const documents = TRAVEL_DOCUMENTS_FIXTURE;
  const isLoading = false;

  const counts: Record<DocumentsTabId, number> = {
    all: documents.length,
    bookings: 0,
    flights: 0,
    stays: 0,
    experiences: 0,
    invoices: 0,
    other: 0,
  };

  for (const doc of documents) {
    counts[doc.category] += 1;
  }

  const visibleDocuments = filterDocuments(documents, activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading documents…
      </div>
    );
  }

  return (
    <>
      <AccountTabNav
        tabs={DOCUMENTS_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: counts[tab.id],
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Document categories"
      />

      <section
        aria-label="Upload a document"
        className="mb-10 rounded-[1.25rem] border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center"
      >
        <p className="text-sm font-medium text-heading">{DOCUMENTS_PAGE_COPY.uploadTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{DOCUMENTS_PAGE_COPY.uploadSupporting}</p>
        <Button type="button" variant="outline" className="mt-4 rounded-full" disabled>
          Browse files
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">{DOCUMENTS_PAGE_COPY.uploadHint}</p>
      </section>

      {documents.length === 0 ? (
        <EmptyState
          title={DOCUMENTS_EMPTY_COPY.title}
          description={DOCUMENTS_EMPTY_COPY.description}
          icon={FileText}
          action={{
            href: DOCUMENTS_EMPTY_COPY.href,
            label: DOCUMENTS_EMPTY_COPY.action,
          }}
        />
      ) : visibleDocuments.length === 0 ? (
        <EmptyState
          title="No documents in this category"
          description="Try another filter or upload a new document."
          icon={FileText}
        />
      ) : (
        <div className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-card">
          {visibleDocuments.map((doc) => (
            <article
              key={doc.id}
              className="flex flex-col gap-4 border-b border-border/60 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText aria-hidden="true" className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-heading sm:text-base">
                    {doc.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {doc.tripLabel} · {doc.dateLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.fileType} · {doc.fileSizeLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <Button type="button" variant="ghost" size="sm" className="rounded-full" disabled>
                  {DOCUMENTS_PAGE_COPY.view}
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled>
                  <Download aria-hidden="true" className="size-4" />
                  <span className="sr-only">{DOCUMENTS_PAGE_COPY.download}</span>
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled>
                  <MoreHorizontal aria-hidden="true" className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="mt-14 border-t border-border/60 pt-12 text-center">
        <h2 className="section-heading text-2xl text-heading sm:text-3xl">
          {DOCUMENTS_BOTTOM_CTA.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          {DOCUMENTS_BOTTOM_CTA.supporting}
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-full px-5">
          <Link href={DOCUMENTS_BOTTOM_CTA.href}>{DOCUMENTS_BOTTOM_CTA.action}</Link>
        </Button>
      </section>
    </>
  );
}

export { DocumentsContent };
