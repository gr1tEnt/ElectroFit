"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "What does 'IP Rating' mean and why is it important?",
    answer:
      "IP (Ingress Protection) ratings are defined by IEC 60529. The first digit indicates protection against solid objects and dust; the second digit indicates protection against water. Choosing the correct IP rating prevents electrical shock, corrosion, and equipment failure in your specific environment.",
  },
  {
    question: "Can I install a standard IP20 socket in my bathroom?",
    answer:
      "Strictly no. Standard IP20 sockets are designed for dry rooms only. In bathrooms — especially within 60 cm of water sources — at least IP44 with appropriate splash protection is required by safety regulations. Use our Smart Selector to find compliant products for wet zones.",
  },
  {
    question: "How does the Modular Configurator guarantee compatibility?",
    answer:
      "The configurator automatically filters and selects frames and single-post mechanisms from the exact same brand and series. It matches post count to mechanism quantity and excludes incompatible double sockets, so every set you add to cart is physically and electrically coherent.",
  },
  {
    question: "What if I need a custom block (e.g., 3 sockets and 1 TV port)?",
    answer:
      "Use our Catalog to select individual mechanisms from the same series, then choose a frame with the matching post count (e.g., a 4-post frame for four modules). The system will suggest the correct frame size based on your selected series and total module count.",
  },
];

interface SupportFaqAccordionProps {
  query?: string;
}

export function SupportFaqAccordion({ query = "" }: SupportFaqAccordionProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqItems[0].question);
  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = faqItems.filter(
    (item) =>
      !normalizedQuery ||
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery),
  );

  if (visibleItems.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-slate-50 px-4 py-6 text-center text-sm text-muted">
        No FAQ matches your search. Try different keywords or contact us below.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {visibleItems.map((item) => {
        const isOpen = openQuestion === item.question;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-brand-200"
          >
            <button
              type="button"
              onClick={() => setOpenQuestion(isOpen ? null : item.question)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink sm:text-base">{item.question}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-brand-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-border px-5 pb-4 pt-1">
                <p className="text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
