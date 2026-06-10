"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RegisterPageClient() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/profile");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Створити обліковий запис</h1>
      <p className="mt-2 text-sm text-muted">
        Зареєструйтеся, щоб зберігати дані та переглядати замовлення.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <AuthForm
          mode="register"
          onSubmit={async ({ email, password, fullName }) => {
            if (!fullName) throw new Error("Повне ім'я обов'язкове");
            await register(email, password, fullName);
          }}
        />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="text-brand-600 hover:underline">
          ← Назад до магазину
        </Link>
      </p>
    </div>
  );
}
