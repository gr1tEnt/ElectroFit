"use client";

import { getErrorMessage } from "@/lib/apiError";
import { submitSupportMessage } from "@/lib/adminApi";
import { useState } from "react";

const inquiryTypes = [
  "Technical Safety Advice",
  "Product Compatibility Issue",
  "Order Support",
  "Other",
] as const;

type InquiryType = (typeof inquiryTypes)[number];

interface FormState {
  fullName: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
}

const initialForm: FormState = {
  fullName: "",
  email: "",
  inquiryType: "Technical Safety Advice",
  message: "",
};

export function SupportInquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitSupportMessage({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        inquiryType: form.inquiryType,
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send your message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-sm">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-lg shadow-emerald-600/20">
          ✓
        </span>
        <h3 className="mt-4 text-xl font-bold text-emerald-900">Thank you!</h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800">
          Your message has been sent. Our support team (or certified electrician) will contact you
          within 2 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(initialForm);
            setError(null);
          }}
          className="mt-6 text-sm font-semibold text-brand-600 transition hover:text-brand-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-lg font-semibold text-ink">Send us a message</h3>
      <p className="mt-1 text-sm text-muted">
        Our team includes certified electricians for technical safety questions.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="support-name" className="mb-1 block text-sm font-medium text-ink">
            Full Name
          </label>
          <input
            id="support-name"
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="support-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="support-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="support-type" className="mb-1 block text-sm font-medium text-ink">
            Inquiry Type
          </label>
          <select
            id="support-type"
            value={form.inquiryType}
            onChange={(e) =>
              setForm({ ...form, inquiryType: e.target.value as InquiryType })
            }
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="support-message" className="mb-1 block text-sm font-medium text-ink">
            Message
          </label>
          <textarea
            id="support-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full resize-y rounded-lg border border-border px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="Describe your question or issue…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? "Sending…" : "Submit inquiry"}
      </button>
    </form>
  );
}
