import type { TravelDocumentCategory, TravelDocumentSummary } from "@gowithus/types";
import { apiFetch, apiUpload } from "./client";

type TravelDocumentListResponse = { items: TravelDocumentSummary[] };

export async function listTravelDocuments(): Promise<TravelDocumentSummary[]> {
  const response = await apiFetch<TravelDocumentListResponse>("/users/me/documents");
  return response.items;
}

export async function uploadTravelDocument(input: {
  file: File;
  name?: string;
  category?: TravelDocumentCategory;
  tripId?: string;
}): Promise<TravelDocumentSummary> {
  const formData = new FormData();
  formData.append("file", input.file);
  if (input.name) {
    formData.append("name", input.name);
  }
  if (input.category) {
    formData.append("category", input.category);
  }
  if (input.tripId) {
    formData.append("tripId", input.tripId);
  }

  const response = await apiUpload<{ document: TravelDocumentSummary }>(
    "/users/me/documents",
    formData,
  );
  return response.document;
}

export async function deleteTravelDocument(documentId: string): Promise<void> {
  await apiFetch(`/users/me/documents/${documentId}`, { method: "DELETE" });
}
