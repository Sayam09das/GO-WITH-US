"use client";

import type { TravelDocumentCategory, TravelDocumentSummary } from "@gowithus/types";
import { Download, FileText, LoaderCircle, MoreHorizontal, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import { EmptyState } from "@/components/states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DOCUMENTS_BOTTOM_CTA,
  DOCUMENTS_EMPTY_COPY,
  DOCUMENTS_PAGE_COPY,
  DOCUMENTS_TABS,
  type DocumentsTabId,
} from "@/lib/account/documents/documents-copy";
import { deleteTravelDocument } from "@/lib/api/documents";
import { cn } from "@/lib/utils";

function filterDocuments(
  items: TravelDocumentSummary[],
  tab: DocumentsTabId,
): TravelDocumentSummary[] {
  if (tab === "all") {
    return items;
  }
  return items.filter((item) => item.category === tab);
}

function countByTab(items: TravelDocumentSummary[]): Record<DocumentsTabId, number> {
  return {
    all: items.length,
    bookings: items.filter((item) => item.category === "bookings").length,
    flights: items.filter((item) => item.category === "flights").length,
    stays: items.filter((item) => item.category === "stays").length,
    experiences: items.filter((item) => item.category === "experiences").length,
    invoices: items.filter((item) => item.category === "invoices").length,
    other: items.filter((item) => item.category === "other").length,
  };
}

interface DocumentsContentViewProps {
  authError?: string | null;
  documents?: TravelDocumentSummary[];
  isLoading?: boolean;
  isUploading?: boolean;
  listError?: string | null;
  uploadError?: string | null;
  uploadName?: string;
  uploadCategory?: TravelDocumentCategory;
  onUploadNameChange?: (value: string) => void;
  onUploadCategoryChange?: (value: TravelDocumentCategory) => void;
  onDocumentsChange?: (documents: TravelDocumentSummary[]) => void;
  fileInputId?: string;
}

function DocumentsContentView({
  authError = null,
  documents = [],
  isLoading = false,
  isUploading = false,
  listError = null,
  uploadError = null,
  uploadName = "",
  uploadCategory = "other",
  onUploadNameChange,
  onUploadCategoryChange,
  onDocumentsChange,
  fileInputId,
}: DocumentsContentViewProps) {
  const [activeTab, setActiveTab] = useState<DocumentsTabId>("all");

  if (authError) {
    return <EmptyState title="Documents unavailable" description={authError} icon={FileText} />;
  }

  const counts = countByTab(documents);
  const visibleDocuments = filterDocuments(documents, activeTab);

  return (
    <>
      {isLoading ? (
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          Loading documents…
        </div>
      ) : null}

      {listError ? (
        <p
          role="status"
          className="mb-6 rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        >
          {listError}
        </p>
      ) : null}

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
        className="mb-10 rounded-[1.25rem] border border-dashed border-border/70 bg-muted/20 px-6 py-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="document-name">Document name</Label>
            <Input
              id="document-name"
              value={uploadName}
              onChange={(event) => onUploadNameChange?.(event.target.value)}
              placeholder="Kyoto hotel confirmation"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="document-category">Category</Label>
            <Select
              value={uploadCategory}
              onValueChange={(value) => onUploadCategoryChange?.(value as TravelDocumentCategory)}
            >
              <SelectTrigger id="document-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENTS_TABS.filter((tab) => tab.id !== "all").map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-heading">{DOCUMENTS_PAGE_COPY.uploadTitle}</p>
          <p className="text-sm text-muted-foreground">{DOCUMENTS_PAGE_COPY.uploadSupporting}</p>
          {isUploading ? (
            <span
              className={cn(
                buttonVariants({ variant: "outline" }),
                "pointer-events-none rounded-full opacity-50",
              )}
              aria-busy="true"
            >
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Uploading…
            </span>
          ) : fileInputId ? (
            <label
              htmlFor={fileInputId}
              className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer rounded-full")}
            >
              <Upload aria-hidden="true" className="size-4" />
              Browse files
            </label>
          ) : (
            <Button type="button" variant="outline" className="rounded-full" disabled>
              <Upload aria-hidden="true" className="size-4" />
              Browse files
            </Button>
          )}
          <p className="text-xs text-muted-foreground">{DOCUMENTS_PAGE_COPY.uploadHint}</p>
          {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}
        </div>
      </section>

      {!isLoading && documents.length === 0 ? (
        <EmptyState
          title={DOCUMENTS_EMPTY_COPY.title}
          description={DOCUMENTS_EMPTY_COPY.description}
          icon={FileText}
          action={{
            href: DOCUMENTS_EMPTY_COPY.href,
            label: DOCUMENTS_EMPTY_COPY.action,
          }}
        />
      ) : null}

      {!isLoading && documents.length > 0 && visibleDocuments.length === 0 ? (
        <EmptyState
          title="No documents in this category"
          description="Try another filter or upload a new document."
          icon={FileText}
        />
      ) : null}

      {!isLoading && visibleDocuments.length > 0 ? (
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
                    {doc.tripLabel ? `${doc.tripLabel} · ` : ""}
                    {doc.dateLabel}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.fileType} · {doc.fileSizeLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <a href={doc.publicUrl} target="_blank" rel="noopener noreferrer">
                    {DOCUMENTS_PAGE_COPY.view}
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <a href={doc.publicUrl} download>
                    <Download aria-hidden="true" className="size-4" />
                    <span className="sr-only">{DOCUMENTS_PAGE_COPY.download}</span>
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    void deleteTravelDocument(doc.id).then(() => {
                      onDocumentsChange?.(documents.filter((item) => item.id !== doc.id));
                    });
                  }}
                >
                  <MoreHorizontal aria-hidden="true" className="size-4" />
                  <span className="sr-only">Remove document</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

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

/** @deprecated Use DocumentsPageShell on the documents page. */
function DocumentsContent() {
  return null;
}

export { DocumentsContent, DocumentsContentView };
