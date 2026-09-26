"use client";

import type { TravelDocumentCategory, TravelDocumentSummary } from "@gowithus/types";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DocumentsContentView } from "@/components/account/documents/documents-content";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  DOCUMENTS_PAGE_COPY,
  TRAVEL_DOCUMENT_FILE_INPUT_ID,
} from "@/lib/account/documents/documents-copy";
import { ApiRequestError } from "@/lib/api/client";
import { listTravelDocuments, uploadTravelDocument } from "@/lib/api/documents";
import { cn } from "@/lib/utils";

function DocumentsPageShell() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<TravelDocumentSummary[]>([]);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<TravelDocumentCategory>("other");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listTravelDocuments()
      .then((items) => {
        if (!cancelled) {
          setDocuments(items);
          setListError(null);
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          if (cause instanceof ApiRequestError && cause.status === 401) {
            setAuthError("Sign in to view your documents.");
            return;
          }
          setListError("We couldn't load your saved documents. You can still upload a new file.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(file: File) {
    setIsUploading(true);
    setUploadError(null);

    try {
      const document = await uploadTravelDocument({
        file,
        name: uploadName.trim() || undefined,
        category: uploadCategory,
      });
      setDocuments((current) => [document, ...current]);
      setListError(null);
      setUploadName("");
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.code === "STORAGE_NOT_CONFIGURED") {
        setUploadError(
          "File storage is not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to the API.",
        );
      } else if (cause instanceof ApiRequestError && cause.code === "STORAGE_UPLOAD_FAILED") {
        setUploadError(
          cause.message ||
            "Upload failed. Confirm the travel-documents bucket exists in Supabase Storage.",
        );
      } else if (cause instanceof ApiRequestError) {
        setUploadError(cause.message || "Upload failed. Check the file type and try again.");
      } else {
        setUploadError("Upload failed. Check the file type and try again.");
      }
    } finally {
      setIsUploading(false);
    }
  }

  function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      void handleUpload(file);
    }
  }

  if (authError) {
    return (
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <DocumentsContentView authError={authError} />
      </div>
    );
  }

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <input
        id={TRAVEL_DOCUMENT_FILE_INPUT_ID}
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        disabled={isUploading}
        onChange={onFileSelected}
      />

      <EditorialPageHeader
        eyebrow={DOCUMENTS_PAGE_COPY.eyebrow}
        heading={DOCUMENTS_PAGE_COPY.heading}
        supporting={DOCUMENTS_PAGE_COPY.supporting}
        action={
          isUploading ? (
            <span
              className={cn(
                buttonVariants(),
                "pointer-events-none w-full rounded-full px-5 opacity-50 sm:w-auto",
              )}
              aria-busy="true"
            >
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Uploading…
            </span>
          ) : (
            <label
              htmlFor={TRAVEL_DOCUMENT_FILE_INPUT_ID}
              className={cn(buttonVariants(), "w-full cursor-pointer rounded-full px-5 sm:w-auto")}
            >
              <Plus aria-hidden="true" className="size-4" />
              {DOCUMENTS_PAGE_COPY.addDocument}
            </label>
          )
        }
      />

      <DocumentsContentView
        documents={documents}
        isLoading={isLoading}
        isUploading={isUploading}
        listError={listError}
        uploadError={uploadError}
        uploadName={uploadName}
        uploadCategory={uploadCategory}
        onUploadNameChange={setUploadName}
        onUploadCategoryChange={setUploadCategory}
        onDocumentsChange={setDocuments}
        fileInputId={TRAVEL_DOCUMENT_FILE_INPUT_ID}
      />
    </div>
  );
}

export { DocumentsPageShell };
