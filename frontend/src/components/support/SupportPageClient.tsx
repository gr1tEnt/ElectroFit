"use client";

import { CONTACT_EMAIL } from "@/lib/siteConfig";
import { SupportFaqAccordion } from "@/components/support/SupportFaqAccordion";
import { SupportInquiryForm } from "@/components/support/SupportInquiryForm";
import { useState } from "react";

export function SupportPageClient() {
  const [faqQuery, setFaqQuery] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Support</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          How can we help you?
        </h1>
        <p className="mt-3 text-muted">
          Find answers about IP ratings, modular compatibility, and safe installations — or reach
          out to our team.
        </p>
        <div className="relative mx-auto mt-8 max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={faqQuery}
            onChange={(e) => setFaqQuery(e.target.value)}
            placeholder="Search FAQ (e.g. IP rating, bathroom, configurator)…"
            aria-label="Search FAQ"
            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-ink">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-muted">
          Electrical safety and ElectroFit tools — explained for homeowners and professionals.
        </p>
        <div className="mt-6">
          <SupportFaqAccordion query={faqQuery} />
        </div>
      </section>

      {/* Form + contact cards */}
      <section className="mt-16 border-t border-border pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <SupportInquiryForm />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">Need Urgent Electrical Advice?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Call our hotline:{" "}
                <a
                  href="tel:+380441234567"
                  className="font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  +380 44 123 4567
                </a>
              </p>
              <p className="mt-1 text-xs text-muted">Mon–Fri, 9:00 – 18:00</p>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-50/50 to-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">Written Inquiries</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Send us an email at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  {CONTACT_EMAIL}
                </a>
                . We usually reply within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
