"use client";

import { OrderHistoryCard } from "@/components/profile/OrderHistoryCard";
import { SavedShippingAddressCard } from "@/components/profile/SavedShippingAddressCard";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/apiError";
import { fetchOrderHistory } from "@/lib/authApi";
import type { OrderHistoryItem } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function ProfileView() {
  const router = useRouter();
  const { user, logout } = useAuth();
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
      setOrdersError(getErrorMessage(err, "Не вдалося завантажити історію замовлень"));
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
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
  }, [loadOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Профіль</h1>
          <p className="mt-2 text-muted">
            Ви увійшли як <span className="font-medium text-ink">{user.fullName}</span> (
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
          Вийти
        </button>
      </div>

      <section className="mt-10">
        <SavedShippingAddressCard userEmail={user.email} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Історія замовлень</h2>

        {ordersError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{ordersError}</p>
        )}

        {ordersLoading ? (
          <p className="mt-4 text-sm text-muted">Завантаження замовлень…</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            Замовлень ще немає. Оформіть замовлення, увійшовши в обліковий запис, і воно з&apos;явиться тут.{" "}
            <Link href="/catalog" className="font-semibold text-brand-600 hover:underline">
              Переглянути каталог
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
