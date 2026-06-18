"use client";

import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/apiError";
import { fetchProductReviews, submitProductReview } from "@/lib/reviewApi";
import type { ProductReview } from "@/types/review";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProductReviewStatistics } from "./ProductReviewStatistics";

interface ProductReviewsSectionProps {
  productId: number;
}

function formatReviewDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function StarRating({
  rating,
  interactive = false,
  onChange,
  size = "md",
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Оцінка">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const filled = value <= rating;

        if (interactive) {
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange?.(value)}
              className={`${starSize} transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded`}
              aria-label={`${value} зір${value === 1 ? "ка" : value < 5 ? "ки" : "ок"}`}
            >
              {filled ? "⭐" : "☆"}
            </button>
          );
        }

        return (
          <span key={value} className={starSize} aria-hidden>
            {filled ? "⭐" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

function VerifiedBuyerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
      <svg
        className="h-3.5 w-3.5 text-emerald-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
      ✓ Підтверджена покупка
    </span>
  );
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { isAuthenticated, user, token } = useAuth();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProductReviews(productId);
      setReviews(data);
    } catch (err) {
      setLoadError(getErrorMessage(err, "Не вдалося завантажити відгуки"));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const created = await submitProductReview(
        {
          productId,
          rating,
          comment: comment.trim(),
        },
        token,
      );
      setReviews((prev) => [created, ...prev]);
      setRating(5);
      setComment("");
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Не вдалося надіслати відгук. Спробуйте ще раз."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8 border-t border-border pt-8">
      <h3 className="text-lg font-bold text-ink">Відгуки та оцінки</h3>
      <p className="mt-1 text-sm text-muted">Діліться враженнями про товар з іншими покупцями.</p>

      {loading && (
        <p className="mt-6 text-sm text-muted">Завантаження відгуків…</p>
      )}

      {loadError && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{loadError}</p>
      )}

      {!loading && !loadError && (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-start">
          <ProductReviewStatistics reviews={reviews} />

          <div>
            {reviews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-slate-50 px-4 py-6 text-center text-sm text-muted">
                Поки немає відгуків. Будьте першим, хто залишить відгук!
              </p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{review.authorName}</p>
                          {review.verifiedBuyer && <VerifiedBuyerBadge />}
                        </div>
                        <p className="text-xs text-muted">{formatReviewDate(review.createdAt)}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div id="product-review-form" className="mt-8 scroll-mt-24">
        {!isAuthenticated && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-5 text-sm text-brand-900 sm:px-6">
            <p>
              Будь ласка,{" "}
              <Link href="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
                увійдіть в акаунт
              </Link>
              , щоб залишити відгук.
            </p>
          </div>
        )}

        {isAuthenticated && (
          <div className="rounded-2xl border border-border bg-slate-50 p-4 sm:p-6">
            <h4 className="text-base font-semibold text-ink">Залишити відгук</h4>

            {submitSuccess && (
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Дякуємо! Ваш відгук успішно опубліковано.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <p className="text-sm text-slate-700">
                Ви залишаєте відгук як:{" "}
                <span className="font-semibold text-ink">{user?.fullName ?? "Користувач"}</span>
              </p>

              <div>
                <p className="text-sm font-medium text-ink">Ваша оцінка</p>
                <div className="mt-1.5">
                  <StarRating rating={rating} interactive onChange={setRating} />
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="text-sm font-medium text-ink">
                  Ваш коментар
                </label>
                <textarea
                  id="review-comment"
                  required
                  minLength={3}
                  maxLength={2000}
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Опишіть якість, зручність монтажу або враження від використання…"
                  className="mt-1.5 w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {submitError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="min-h-11 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Надсилання…" : "Надіслати відгук"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
