"use client";

import { getErrorMessage } from "@/lib/apiError";
import { fetchSupportMessages, resolveSupportMessage } from "@/lib/adminApi";
import type { SupportMessage } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("uk-UA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function EnvelopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function buildReplyMailto(message: SupportMessage): string {
  const subject = `Відповідь: ${message.inquiryType} - ElectroFit`;
  const body = `Вітаємо, ${message.fullName},\n\nЩодо вашого звернення: «${message.message}»\n\n`;
  return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function SupportInbox() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSupportMessages();
      setMessages(data);
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося завантажити звернення"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleReply = (message: SupportMessage) => {
    window.location.href = buildReplyMailto(message);
  };

  const handleResolve = async (message: SupportMessage) => {
    setResolvingId(message.id);
    setError(null);
    try {
      await resolveSupportMessage(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося позначити звернення як вирішене"));
    } finally {
      setResolvingId(null);
    }
  };

  const inquiryCountLabel = (count: number) => {
    if (count === 1) return "1 невирішене звернення";
    if (count >= 2 && count <= 4) return `${count} невирішені звернення`;
    return `${count} невирішених звернень`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Звернення клієнтів</h2>
          <p className="mt-1 text-slate-400">
            {loading ? "Завантаження…" : inquiryCountLabel(messages.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Оновити
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-6 space-y-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
            />
          ))}

        {!loading && messages.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-300">Вхідні порожні</p>
            <p className="mt-1 text-sm text-slate-500">
              Нові звернення клієнтів зі сторінки підтримки з&apos;являться тут.
            </p>
          </div>
        )}

        {!loading &&
          messages.map((message) => (
            <article
              key={message.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <h3 className="font-semibold text-white">{message.fullName}</h3>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-sky-400 hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-medium text-amber-300">
                      {message.inquiryType}
                    </span>
                    <span className="text-slate-500">{formatDate(message.createdAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReply(message)}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    <EnvelopeIcon />
                    Відповісти
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(message)}
                    disabled={resolvingId === message.id}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {resolvingId === message.id ? "Обробка…" : "Позначити як вирішене"}
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                {message.message}
              </p>
            </article>
          ))}
      </div>
    </div>
  );
}
