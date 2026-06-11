"use client";

import { OrderHistoryCard } from "@/components/profile/OrderHistoryCard";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/apiError";
import { fetchOrderHistory } from "@/lib/authApi";
import type { OrderHistoryItem } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function ProfileView() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await fetchOrderHistory();
      setOrders(data);
    } catch (err) {
      setOrders([]);
      setOrdersError(getErrorMessage(err, "Could not load order history"));
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadOrders();
  }, [isAuthenticated, loadOrders]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refresh = () => void loadOrders();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    });

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, [isAuthenticated, loadOrders]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Profile</h1>
          <p className="mt-2 text-muted">
            Signed in as <span className="font-medium text-ink">{user.fullName}</span> (
            {user.email})
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
        >
          Sign out
        </button>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Order history</h2>

        {ordersError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{ordersError}</p>
        )}

        {ordersLoading ? (
          <p className="mt-4 text-sm text-muted">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No orders yet. Place an order while signed in and it will appear here.{" "}
            <Link href="/catalog" className="font-semibold text-brand-600 hover:underline">
              Browse catalog
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <OrderHistoryCard
                key={order.orderNumber}
                order={order}
                customerName={user.fullName}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
