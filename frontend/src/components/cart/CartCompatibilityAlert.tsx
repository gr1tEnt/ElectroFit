"use client";

import { formatSeriesList } from "@/lib/cartCompatibility";
import { useEffect, useState } from "react";

interface CartCompatibilityAlertProps {
  series: string[];
}

export function CartCompatibilityAlert({ series }: CartCompatibilityAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const seriesKey = series.join("|");

  useEffect(() => {
    setDismissed(false);
  }, [seriesKey]);

  if (dismissed || series.length < 2) {
    return null;
  }

  const exampleSeries = formatSeriesList(series);

  return (
    <div
      role="alert"
      className="relative rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-red-50 p-4 shadow-sm md:p-5"
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amber-700 transition-colors hover:bg-amber-100/80 hover:text-amber-900"
        aria-label="Закрити попередження"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      </button>

      <div className="flex gap-3 pr-10 md:gap-4">
        <span className="mt-0.5 text-2xl leading-none" aria-hidden>
          ⚠️
        </span>
        <div>
          <h2 className="text-base font-bold text-red-900 md:text-lg">
            Увага! Ризик несумісності товарів
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-red-800/90">
            У вашому кошику знаходяться товари з різних серій (наприклад, {exampleSeries}).
            Механізми та рамки різних серій фізично не з&apos;єднуються. Будь ласка, перевірте
            ваше замовлення.
          </p>
        </div>
      </div>
    </div>
  );
}
