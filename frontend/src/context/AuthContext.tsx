"use client";

import { fetchCurrentUser, loginUser, registerUser } from "@/lib/authApi";
import { clearAuthSession, loadAuthSession, saveAuthSession } from "@/lib/authStorage";
import type { AuthSession, AuthUser } from "@/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadAuthSession();
    if (!stored) {
      setLoading(false);
      return;
    }

    setSession(stored);
    fetchCurrentUser()
      .then((user) => {
        const next = { token: stored.token, user };
        saveAuthSession(next);
        setSession(next);
      })
      .catch(() => {
        clearAuthSession();
        setSession(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const applySession = useCallback((next: AuthSession) => {
    saveAuthSession(next);
    setSession(next);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await loginUser({ email, password });
      applySession(next);
    },
    [applySession],
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const next = await registerUser({ email, password, fullName });
      applySession(next);
    },
    [applySession],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session != null,
      loading,
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
