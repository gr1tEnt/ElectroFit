"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Що означає «ступінь захисту IP» і чому це важливо?",
    answer:
      "Ступінь захисту IP (Ingress Protection) визначена стандартом IEC 60529. Перша цифра показує захист від твердих предметів і пилу; друга — від води. Правильний вибір IP запобігає ураженню електричним струмом, корозії та виходу з ладу обладнання у вашому середовищі.",
  },
  {
    question: "Чи можна встановити стандартну розетку IP20 у ванній кімнаті?",
    answer:
      "Категорично ні. Стандартні розетки IP20 призначені лише для сухих приміщень. У ванних кімнатах — особливо в межах 60 см від джерел води — згідно з нормами безпеки потрібен мінімум IP44 з відповідним захистом від бризок. Скористайтеся Розумним підбором, щоб знайти відповідні товари для вологих зон.",
  },
  {
    question: "Як Конфігуратор рамок гарантує сумісність?",
    answer:
      "Конфігуратор автоматично відбирає рамки та однопостові механізми одного бренду й серії. Він узгоджує кількість позицій із кількістю механізмів і виключає несумісні подвійні розетки, тож кожен комплект у кошику є фізично та електрично цілісним.",
  },
  {
    question: "Що робити, якщо потрібен нестандартний блок (наприклад, 3 розетки та 1 TV-порт)?",
    answer:
      "Скористайтеся Каталогом, щоб обрати окремі механізми однієї серії, потім оберіть рамку з відповідною кількістю позицій (наприклад, 4-позиційну рамку для чотирьох модулів). Система запропонує правильний розмір рамки залежно від обраної серії та загальної кількості модулів.",
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
        За вашим запитом нічого не знайдено. Спробуйте інші ключові слова або зв&apos;яжіться з нами нижче.
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
