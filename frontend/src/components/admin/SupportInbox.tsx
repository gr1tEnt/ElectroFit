"use client";

import { getErrorMessage } from "@/lib/apiError";
import { fetchSupportMessages, replyToSupportTicket, resolveSupportMessage } from "@/lib/adminApi";
import { toastSupportReplySent } from "@/lib/toast";
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

interface ReplyModalProps {
  message: SupportMessage;
  sending: boolean;
  error: string | null;
  onClose: () => void;
  onSend: (replyMessage: string) => void;
}

function ReplyModal({ message, sending, error, onClose, onSend }: ReplyModalProps) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(replyText.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reply-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="reply-modal-title" className="text-lg font-semibold text-white">
              Відповісти клієнту
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {message.fullName} · {message.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 rounded-lg bg-slate-800/80 px-3 py-2 text-xs text-slate-400">
          Звернення: «{message.message.length > 120 ? `${message.message.slice(0, 120)}…` : message.message}»
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="support-reply-text" className="mb-1.5 block text-sm font-medium text-slate-200">
              Текст відповіді
            </label>
            <textarea
              id="support-reply-text"
              required
              minLength={3}
              maxLength={5000}
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sending}
              placeholder="Введіть відповідь для клієнта…"
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={sending || replyText.trim().length < 3}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Надсилання…" : "Надіслати"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SupportInbox() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [replyTarget, setReplyTarget] = useState<SupportMessage | null>(null);
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

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

  const handleOpenReply = (message: SupportMessage) => {
    setReplyError(null);
    setReplyTarget(message);
  };

  const handleCloseReply = () => {
    if (replySending) return;
    setReplyTarget(null);
    setReplyError(null);
  };

  const handleSendReply = async (replyMessage: string) => {
    if (!replyTarget) return;

    setReplySending(true);
    setReplyError(null);

    try {
      const updated = await replyToSupportTicket(replyTarget.id, { replyMessage });
      setMessages((prev) => prev.filter((m) => m.id !== replyTarget.id));
      setReplyTarget(null);
      toastSupportReplySent();

      if (updated.status === "RESOLVED") {
        return;
      }
    } catch (err) {
      setReplyError(getErrorMessage(err, "Не вдалося надіслати відповідь"));
    } finally {
      setReplySending(false);
    }
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
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                    <h3 className="font-semibold text-white">{message.fullName}</h3>
                    <span className="text-sm text-slate-400">{message.email}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-medium text-amber-300">
                      {message.inquiryType}
                    </span>
                    <span className="text-slate-500">{formatDate(message.createdAt)}</span>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOpenReply(message)}
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

      {replyTarget && (
        <ReplyModal
          message={replyTarget}
          sending={replySending}
          error={replyError}
          onClose={handleCloseReply}
          onSend={(text) => void handleSendReply(text)}
        />
      )}
    </div>
  );
}
