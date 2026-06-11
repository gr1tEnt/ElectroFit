"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const orderId = searchParams.get("orderId") ?? "—";

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 text-center shadow-lg sm:p-10">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg shadow-emerald-600/25">
        ✓
      </span>
      <h1 className="mt-6 text-2xl font-bold text-emerald-950 sm:text-3xl">
        Order successfully placed!
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-emerald-900 sm:text-base">
        Your order ID is{" "}
        <span className="font-mono font-semibold text-emerald-800">{orderId}</span>. You can track
        it in your profile.
      </p>
      <p className="mt-2 text-xs text-emerald-700">
        A confirmation email will be sent shortly (simulated).
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {isAuthenticated ? (
          <Link
            href="/profile"
            className="inline-flex justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            View order history
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Sign in to track order
          </Link>
        )}
        <Link
          href="/catalog"
          className="inline-flex justify-center rounded-xl border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
