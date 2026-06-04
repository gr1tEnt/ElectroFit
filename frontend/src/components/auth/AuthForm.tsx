"use client";

import { getErrorMessage } from "@/lib/apiError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (payload: { email: string; password: string; fullName?: string }) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        email: email.trim(),
        password,
        fullName: isRegister ? fullName.trim() : undefined,
      });
      router.push("/profile");
    } catch (err) {
      setError(getErrorMessage(err, isRegister ? "Registration failed" : "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {isRegister && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
            autoComplete="name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={isRegister ? 8 : 1}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
        {isRegister && (
          <p className="mt-1 text-xs text-muted">At least 8 characters</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-brand-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
