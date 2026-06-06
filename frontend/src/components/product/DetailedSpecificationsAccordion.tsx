"use client";

import { useState } from "react";

interface DetailedSpecificationsAccordionProps {
  attributes?: Record<string, string> | null;
}

export function DetailedSpecificationsAccordion({
  attributes,
}: DetailedSpecificationsAccordionProps) {
  const [open, setOpen] = useState(false);
  const entries = attributes ? Object.entries(attributes) : [];

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 border-t border-border pt-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-slate-50/80 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="text-sm font-semibold text-ink">Detailed Specifications</span>
        <svg
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">{key}</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
