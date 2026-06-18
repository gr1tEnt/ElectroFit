export interface ProductReview {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface CreateReviewPayload {
  productId: number;
  rating: number;
  comment: string;
}

export interface CanReviewResponse {
  canReview: boolean;
}
