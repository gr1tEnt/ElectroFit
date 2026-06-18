"use client";

import { computeReviewStatistics, formatReviewsBasisLabel, scrollToReviewForm } from "@/lib/reviewUtils";
import type { ProductReview } from "@/types/review";

interface ProductReviewStatisticsProps {
  reviews: ProductReview[];
}

function SummaryStarIcon() {
  return (
    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function RowStarIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function ProductReviewStatistics({ reviews }: ProductReviewStatisticsProps) {
  const { totalReviews, averageRating, distribution } = computeReviewStatistics(reviews);
  const formattedAverage = averageRating.toFixed(2);

  return (
    <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <SummaryStarIcon />
        <h4 className="text-lg font-bold text-ink">
          Оцінка користувачів {formattedAverage}/5
        </h4>
      </div>
      <p className="mt-1 text-sm text-muted">
        на основі {formatReviewsBasisLabel(totalReviews)}
      </p>

      <ul className="mt-5 space-y-2.5" aria-label="Розподіл оцінок">
        {distribution.map(({ stars, count, percentage }) => (
          <li key={stars} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="flex w-10 items-center gap-1 text-sm font-medium text-slate-700">
              <span>{stars}</span>
              <RowStarIcon />
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={Math.round(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${stars} зірок: ${count} відгуків`}
              />
            </div>
            <span className="min-w-[2rem] text-right text-sm tabular-nums text-slate-600">{count}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={scrollToReviewForm}
        className="mt-6 w-full rounded-xl border-2 border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        Написати відгук
      </button>
    </aside>
  );
}
