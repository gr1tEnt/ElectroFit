interface CatalogStarRatingProps {
  averageRating: number;
  reviewCount: number;
  className?: string;
}

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${filled ? "text-amber-400" : "text-slate-300"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

export function CatalogStarRating({ averageRating, reviewCount, className = "" }: CatalogStarRatingProps) {
  const hasReviews = reviewCount > 0;
  const filledStars = hasReviews ? Math.min(5, Math.max(0, Math.round(averageRating))) : 0;

  return (
    <div
      className={`flex min-h-5 items-center ${className}`}
      aria-label={
        hasReviews
          ? `Оцінка ${averageRating.toFixed(1)} з 5, ${reviewCount} відгуків`
          : `Немає відгуків`
      }
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} filled={index < filledStars} />
        ))}
      </div>

      <span className="ml-1.5 text-xs leading-none text-slate-500">({reviewCount})</span>
    </div>
  );
}
