import type { StayReviewItem } from "@gowithus/types";
import { apiFetch } from "./client";

type ApiReviewAggregate = {
  average?: number;
  count?: number;
  averageRating?: number;
  reviewCount?: number;
};

type ReviewListResponse = {
  reviews: StayReviewItem[];
  aggregate: ApiReviewAggregate;
};

export type ReviewSectionData = {
  reviews: StayReviewItem[];
  averageRating: number;
  reviewCount: number;
};

function mapReviewResponse(response: ReviewListResponse): ReviewSectionData {
  return {
    reviews: response.reviews,
    averageRating: response.aggregate.averageRating ?? response.aggregate.average ?? 0,
    reviewCount: response.aggregate.reviewCount ?? response.aggregate.count ?? 0,
  };
}

export async function listStayReviews(stayId: string): Promise<ReviewSectionData | null> {
  try {
    const response = await apiFetch<ReviewListResponse>(`/stays/${stayId}/reviews`);
    return mapReviewResponse(response);
  } catch {
    return null;
  }
}

export async function listExperienceReviews(
  experienceId: string,
): Promise<ReviewSectionData | null> {
  try {
    const response = await apiFetch<ReviewListResponse>(`/experiences/${experienceId}/reviews`);
    return mapReviewResponse(response);
  } catch {
    return null;
  }
}

export async function listDestinationReviews(
  destinationId: string,
): Promise<ReviewSectionData | null> {
  try {
    const response = await apiFetch<ReviewListResponse>(`/destinations/${destinationId}/reviews`);
    return mapReviewResponse(response);
  } catch {
    return null;
  }
}

export async function createReview(input: {
  targetType: "DESTINATION" | "STAY" | "EXPERIENCE" | "RESTAURANT";
  targetId: string;
  rating: number;
  title?: string;
  body?: string;
}): Promise<StayReviewItem> {
  const response = await apiFetch<{ review: StayReviewItem }>("/reviews", {
    method: "POST",
    body: input,
  });
  return response.review;
}
