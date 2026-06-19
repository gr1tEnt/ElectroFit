"use client";

import { getErrorMessage } from "@/lib/apiError";
import { requestPasswordReset, resetPasswordWithPin } from "@/lib/authApi";
import { toastPasswordResetCodeSent, toastPasswordResetSuccess } from "@/lib/toast";
import { useState } from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (submitting) return;
    setStep(1);
    setEmail("");
    setPin("");
    setNewPassword("");
    setError(null);
    onClose();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await requestPasswordReset(email.trim());
      toastPasswordResetCodeSent();
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося надіслати код. Спробуйте ще раз."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await resetPasswordWithPin({
        email: email.trim(),
        pin: pin.trim(),
        newPassword,
      });
      toastPasswordResetSuccess();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося змінити пароль. Перевірте код і спробуйте ще раз."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="forgot-password-title" className="text-lg font-bold text-ink">
              Відновлення пароля
            </h2>
            <p className="mt-1 text-sm text-muted">
              {step === 1
                ? "Введіть email — ми надішлемо 6-значний код."
                : "Введіть код з листа та новий пароль."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1 text-muted transition hover:bg-slate-100 hover:text-ink disabled:opacity-50"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={(e) => void handleSendCode(e)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-ink">
                Електронна пошта
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Надсилання…" : "Надіслати код"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => void handleResetPassword(e)} className="mt-6 space-y-4">
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Код надіслано на: <span className="font-medium text-ink">{email}</span>
            </p>

            <div>
              <label htmlFor="forgot-pin" className="block text-sm font-medium text-ink">
                6-значний код
              </label>
              <input
                id="forgot-pin"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm tracking-widest"
                autoComplete="one-time-code"
                placeholder="000000"
              />
            </div>

            <div>
              <label htmlFor="forgot-new-password" className="block text-sm font-medium text-ink">
                Новий пароль
              </label>
              <input
                id="forgot-new-password"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-muted">Щонайменше 8 символів</p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPin("");
                  setNewPassword("");
                  setError(null);
                }}
                disabled={submitting}
                className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Назад
              </button>
              <button
                type="submit"
                disabled={submitting || pin.length !== 6}
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {submitting ? "Збереження…" : "Змінити пароль"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
