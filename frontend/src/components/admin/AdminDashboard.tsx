"use client";

import { getErrorMessage } from "@/lib/apiError";
import { fetchAdminStats, fetchDashboardStats } from "@/lib/adminApi";
import type { AdminStats, DashboardStats, OrderStatus } from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const POLL_INTERVAL_MS = 15_000;

export function AdminDashboard() {
  const [kpiStats, setKpiStats] = useState<AdminStats | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);

    const [kpiResult, analyticsResult] = await Promise.allSettled([
      fetchAdminStats(),
      fetchDashboardStats(),
    ]);

    if (kpiResult.status === "fulfilled") {
      setKpiStats(kpiResult.value);
    }
    if (analyticsResult.status === "fulfilled") {
      setDashboard(normalizeDashboardStats(analyticsResult.value));
    }

    const failures: string[] = [];
    if (kpiResult.status === "rejected") {
      failures.push(getErrorMessage(kpiResult.reason, "Failed to load overview stats"));
    }
    if (analyticsResult.status === "rejected") {
      failures.push(getErrorMessage(analyticsResult.reason, "Failed to load sales analytics"));
    }
    setError(failures.length > 0 ? failures.join(" ") : null);

    if (kpiResult.status === "fulfilled" || analyticsResult.status === "fulfilled") {
      setLastUpdated(new Date());
    }

    if (isInitial) setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard(true);
    const intervalId = window.setInterval(() => loadDashboard(false), POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [loadDashboard]);

  const chartData = useMemo(
    () =>
      (dashboard?.salesChartData ?? []).map((point) => ({
        month: point.month,
        revenue: Number(point.revenue),
      })),
    [dashboard?.salesChartData],
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="mt-1 text-slate-400">Overview metrics and live sales analytics.</p>
        </div>
        <LiveIndicator lastUpdated={lastUpdated} loading={loading} />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Total Products"
          value={loading ? "…" : String(kpiStats?.totalProducts ?? 0)}
          hint="Items in catalog"
          accent="amber"
          loading={loading}
        />
        <KpiCard
          label="Unresolved Inquiries"
          value={loading ? "…" : String(kpiStats?.unresolvedInquiries ?? 0)}
          hint="Support messages in queue"
          accent="sky"
          loading={loading}
        />
        <KpiCard
          label="Total Brands"
          value={loading ? "…" : String(kpiStats?.totalBrands ?? 0)}
          hint="Active brand series"
          accent="emerald"
          loading={loading}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Revenue trend</h3>
            <p className="mt-1 text-sm text-slate-400">Monthly completed-order revenue</p>
          </div>
          <p className="text-sm font-semibold text-indigo-300">
            Total revenue:{" "}
            <span className="text-xl text-white">
              {loading ? "…" : formatCurrency(dashboard?.totalRevenue ?? 0)}
            </span>
          </p>
        </div>

        <div className="mt-6 h-72 w-full">
          {loading && chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl bg-slate-800/40">
              <p className="text-sm text-slate-500">Loading chart…</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `€${value}`}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 5, fill: "#a5b4fc", stroke: "#312e81", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-white">Recent orders</h3>
        <p className="mt-1 text-sm text-slate-400">
          Latest customer orders — auto-refreshes every 15 seconds.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-800">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-800" />
                      </td>
                    </tr>
                  ))}
                {!loading && (dashboard?.recentOrders.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
                {!loading &&
                  dashboard?.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-800/80 transition hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        ORD-{order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-white">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-indigo-200">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    COMPLETED: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    PENDING: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    SHIPPED: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function LiveIndicator({ lastUpdated, loading }: { lastUpdated: Date | null; loading: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-400">
      <span
        className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`}
        aria-hidden
      />
      {lastUpdated
        ? `Live · updated ${lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
        : "Connecting…"}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  accent,
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "amber" | "sky" | "emerald";
  loading: boolean;
}) {
  const accentStyles = {
    amber: "from-amber-500/10 to-slate-900 border-amber-500/20",
    sky: "from-sky-500/10 to-slate-900 border-sky-500/20",
    emerald: "from-emerald-500/10 to-slate-900 border-emerald-500/20",
  }[accent];

  const valueStyles = {
    amber: "text-amber-300",
    sky: "text-sky-300",
    emerald: "text-emerald-300",
  }[accent];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 ${accentStyles} ${loading ? "animate-pulse" : ""}`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className={`mt-2 text-4xl font-bold tracking-tight ${valueStyles}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function normalizeDashboardStats(raw: DashboardStats): DashboardStats {
  return {
    totalRevenue: Number(raw.totalRevenue),
    recentOrders: raw.recentOrders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    })),
    salesChartData: raw.salesChartData.map((point) => ({
      month: point.month,
      revenue: Number(point.revenue),
    })),
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
