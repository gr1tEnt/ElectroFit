"use client";

import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
  loadingMessage = "Перевірка доступу…",
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  if (loading || !isAuthenticated) {
    return <AuthLoadingScreen message={loadingMessage} />;
  }

  return <>{children}</>;
}
