import { apiFetch } from "@/lib/httpClient";
import type { CanReviewResponse, CreateReviewPayload, ProductReview } from "@/types/review";

export function fetchProductReviews(productId: number): Promise<ProductReview[]> {
  return apiFetch<ProductReview[]>(`/api/reviews/product/${productId}`);
}

export function fetchCanReviewProduct(
  productId: number,
  authToken?: string | null,
): Promise<CanReviewResponse> {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return apiFetch<CanReviewResponse>(`/api/reviews/can-review/${productId}`, {
    headers,
  });
}

export function submitProductReview(
  payload: CreateReviewPayload,
  authToken?: string | null,
): Promise<ProductReview> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return apiFetch<ProductReview>("/api/reviews", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}
