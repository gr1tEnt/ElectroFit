"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginPageClient() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/profile");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Вхід</h1>
      <p className="mt-2 text-sm text-muted">
        Доступ до профілю та історії замовлень.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <AuthForm
          mode="login"
          onSubmit={async ({ email, password }) => login(email, password)}
          onForgotPassword={() => setForgotPasswordOpen(true)}
        />
      </div>
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="text-brand-600 hover:underline">
          ← Назад до магазину
        </Link>
      </p>
    </div>
  );
}
