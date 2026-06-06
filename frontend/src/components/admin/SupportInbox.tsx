"use client";

import { getErrorMessage } from "@/lib/apiError";
import { fetchSupportMessages, resolveSupportMessage } from "@/lib/adminApi";
import type { SupportMessage } from "@/types/admin";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
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
      setError(getErrorMessage(err, "Failed to load support messages"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleResolve = async (message: SupportMessage) => {
    setResolvingId(message.id);
    setError(null);
    try {
      await resolveSupportMessage(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to resolve message"));
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Inquiries</h2>
          <p className="mt-1 text-slate-400">
            {loading
              ? "Loading…"
              : `${messages.length} unresolved ${messages.length === 1 ? "inquiry" : "inquiries"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Refresh
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
            <p className="text-lg font-medium text-slate-300">Inbox is clear</p>
            <p className="mt-1 text-sm text-slate-500">
              New customer inquiries from the Support page will appear here.
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
                <button
                  type="button"
                  onClick={() => handleResolve(message)}
                  disabled={resolvingId === message.id}
                  className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {resolvingId === message.id ? "Resolving…" : "Mark as Resolved"}
                </button>
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
