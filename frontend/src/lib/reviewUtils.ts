import type { ProductReview } from "@/types/review";

export interface ReviewDistribution {
  stars: 5 | 4 | 3 | 2 | 1;
  count: number;
  percentage: number;
}

export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  distribution: ReviewDistribution[];
}

const STAR_LEVELS: Array<5 | 4 | 3 | 2 | 1> = [5, 4, 3, 2, 1];

export function computeReviewStatistics(reviews: ProductReview[]): ReviewStatistics {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 5.0;

  const distribution = STAR_LEVELS.map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return { totalReviews, averageRating, distribution };
}

/** Ukrainian plural for "на основі N …" subtitle (відгуку / відгуки / відгуків). */
export function formatReviewsBasisLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} відгуку`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} відгуки`;
  }
  return `${count} відгуків`;
}

export function scrollToReviewForm(): void {
  document.getElementById("product-review-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
