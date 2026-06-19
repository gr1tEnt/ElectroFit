"use client";

import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { ForbiddenPage } from "@/components/auth/ForbiddenPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <AuthLoadingScreen message="Перевірка доступу…" />;
  }

  if (!isAuthenticated) {
    return <AuthLoadingScreen message="Перевірка доступу…" />;
  }

  if (user?.role !== "ADMIN") {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
