"use client";

import { getErrorMessage } from "@/lib/apiError";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = getErrorMessage(error, "This page could not be loaded.");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">Page error</h1>
      <p className="mt-4 text-sm text-muted">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
